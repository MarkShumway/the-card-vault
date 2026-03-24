import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAddCardMutation, useUploadCardImageMutation } from '../features/cards/cardsApi'
import { useAppSelector } from '../store/hooks'
import Header from '../components/layout/Header'
import type { Sport, CardCondition } from '../types'

// ─── Zod schema ───────────────────────────────────────────────────────────────

const cardSchema = z.object({
    player_name: z.string().min(1, 'Player name is required'),
    year: z
        .number({ error: 'Year is required' })
        .int()
        .min(1800, 'Year must be 1800 or later')
        .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
    brand: z.string().min(1, 'Brand is required'),
    series: z.string().optional(),
    card_number: z.string().optional(),
    sport: z.enum(['baseball', 'hockey', 'football', 'basketball']),
    condition: z.enum([
        'PSA 10', 'PSA 9', 'PSA 8', 'PSA 7',
        'BGS 9.5', 'BGS 9',
        'Raw - Mint', 'Raw - Near Mint', 'Raw - Excellent', 'Raw - Good',
    ]),
    purchase_price: z
        .number({ error: 'Purchase price is required' })
        .min(0, 'Price cannot be negative'),
    current_value: z
        .number({ error: 'Current value is required' })
        .min(0, 'Value cannot be negative'),
    notes: z.string().optional(),
})

type CardFormValues = z.infer<typeof cardSchema>

// ─── Component ────────────────────────────────────────────────────────────────

function AddCardPage() {
    const navigate = useNavigate()
    const { user } = useAppSelector((state) => state.auth)
    const [addCard, { isLoading: isAdding }] = useAddCardMutation()
    const [uploadImage, { isLoading: isUploading }] = useUploadCardImageMutation()
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [serverError, setServerError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CardFormValues>({
        resolver: zodResolver(cardSchema),
        defaultValues: {
            sport: 'baseball',
            condition: 'Raw - Near Mint',
            purchase_price: 0,
            current_value: 0,
        },
    })

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    const onSubmit = async (values: CardFormValues) => {
        if (!user) return
        setServerError(null)

        try {
            let image_url: string | null = null

            // Upload image first if one was selected
            if (imageFile) {
                const result = await uploadImage({
                    userId: user.id,
                    file: imageFile,
                }).unwrap()
                image_url = result
            }

            await addCard({
                user_id: user.id,
                player_name: values.player_name,
                year: values.year,
                brand: values.brand,
                series: values.series ?? null,
                card_number: values.card_number ?? null,
                sport: values.sport as Sport,
                condition: values.condition as CardCondition,
                purchase_price: values.purchase_price,
                current_value: values.current_value,
                notes: values.notes ?? null,
                image_url,
            }).unwrap()

            navigate('/collection')
        } catch {
            setServerError('Something went wrong saving your card. Please try again.')
        }
    }

    const isSubmitting = isAdding || isUploading

    return (
        <div className="add-card-page">
            <Header />

            <main className="add-card-page__main">
                <h2 className="add-card-page__heading">Add New Card</h2>

                {serverError && (
                    <div className="login__server-error" style={{ marginBottom: '1rem' }}>
                        {serverError}
                    </div>
                )}

                <form className="card-form" onSubmit={handleSubmit(onSubmit)}>

                    {/* ── Player Info ── */}
                    <div className="card-form__section">
                        <h3 className="card-form__section-title">Player Info</h3>

                        <div className="card-form__row">
                            <div className="card-form__field">
                                <label className="card-form__label">
                                    Player Name <span>*</span>
                                </label>
                                <input
                                    className={`card-form__input${errors.player_name ? ' card-form__input--error' : ''}`}
                                    placeholder="e.g. Mike Trout"
                                    {...register('player_name')}
                                />
                                {errors.player_name && (
                                    <span className="card-form__error">{errors.player_name.message}</span>
                                )}
                            </div>

                            <div className="card-form__field">
                                <label className="card-form__label">
                                    Sport <span>*</span>
                                </label>
                                <select
                                    className="card-form__select"
                                    {...register('sport')}
                                >
                                    <option value="baseball">Baseball</option>
                                    <option value="hockey">Hockey</option>
                                    <option value="football">Football</option>
                                    <option value="basketball">Basketball</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* ── Card Details ── */}
                    <div className="card-form__section">
                        <h3 className="card-form__section-title">Card Details</h3>

                        <div className="card-form__row card-form__row--three">
                            <div className="card-form__field">
                                <label className="card-form__label">
                                    Year <span>*</span>
                                </label>
                                <input
                                    className={`card-form__input${errors.year ? ' card-form__input--error' : ''}`}
                                    type="number"
                                    placeholder="e.g. 2021"
                                    {...register('year', { valueAsNumber: true })}
                                />
                                {errors.year && (
                                    <span className="card-form__error">{errors.year.message}</span>
                                )}
                            </div>

                            <div className="card-form__field">
                                <label className="card-form__label">
                                    Brand <span>*</span>
                                </label>
                                <input
                                    className={`card-form__input${errors.brand ? ' card-form__input--error' : ''}`}
                                    placeholder="e.g. Topps"
                                    {...register('brand')}
                                />
                                {errors.brand && (
                                    <span className="card-form__error">{errors.brand.message}</span>
                                )}
                            </div>

                            <div className="card-form__field">
                                <label className="card-form__label">Series</label>
                                <input
                                    className="card-form__input"
                                    placeholder="e.g. Chrome"
                                    {...register('series')}
                                />
                            </div>
                        </div>

                        <div className="card-form__row">
                            <div className="card-form__field">
                                <label className="card-form__label">Card Number</label>
                                <input
                                    className="card-form__input"
                                    placeholder="e.g. 27"
                                    {...register('card_number')}
                                />
                            </div>

                            <div className="card-form__field">
                                <label className="card-form__label">
                                    Condition <span>*</span>
                                </label>
                                <select
                                    className="card-form__select"
                                    {...register('condition')}
                                >
                                    <optgroup label="PSA">
                                        <option value="PSA 10">PSA 10</option>
                                        <option value="PSA 9">PSA 9</option>
                                        <option value="PSA 8">PSA 8</option>
                                        <option value="PSA 7">PSA 7</option>
                                    </optgroup>
                                    <optgroup label="BGS">
                                        <option value="BGS 9.5">BGS 9.5</option>
                                        <option value="BGS 9">BGS 9</option>
                                    </optgroup>
                                    <optgroup label="Raw">
                                        <option value="Raw - Mint">Raw - Mint</option>
                                        <option value="Raw - Near Mint">Raw - Near Mint</option>
                                        <option value="Raw - Excellent">Raw - Excellent</option>
                                        <option value="Raw - Good">Raw - Good</option>
                                    </optgroup>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* ── Pricing ── */}
                    <div className="card-form__section">
                        <h3 className="card-form__section-title">Pricing</h3>

                        <div className="card-form__row">
                            <div className="card-form__field">
                                <label className="card-form__label">
                                    Purchase Price ($) <span>*</span>
                                </label>
                                <input
                                    className={`card-form__input${errors.purchase_price ? ' card-form__input--error' : ''}`}
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...register('purchase_price', { valueAsNumber: true })}
                                />
                                {errors.purchase_price && (
                                    <span className="card-form__error">{errors.purchase_price.message}</span>
                                )}
                            </div>

                            <div className="card-form__field">
                                <label className="card-form__label">
                                    Current Value ($) <span>*</span>
                                </label>
                                <input
                                    className={`card-form__input${errors.current_value ? ' card-form__input--error' : ''}`}
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    {...register('current_value', { valueAsNumber: true })}
                                />
                                {errors.current_value && (
                                    <span className="card-form__error">{errors.current_value.message}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── Image ── */}
                    <div className="card-form__section">
                        <h3 className="card-form__section-title">Card Image</h3>

                        <div className="card-form__image-upload">
                            {imagePreview ? (
                                <img
                                    className="card-form__image-preview"
                                    src={imagePreview}
                                    alt="Card preview"
                                />
                            ) : (
                                <div
                                    className="card-form__image-placeholder"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <span>+</span>
                                    <span>Click to upload image</span>
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                className="card-form__image-input"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                            />

                            {imagePreview && (
                                <button
                                    type="button"
                                    className="card-form__cancel"
                                    onClick={() => {
                                        setImageFile(null)
                                        setImagePreview(null)
                                    }}
                                >
                                    Remove Image
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ── Notes ── */}
                    <div className="card-form__section">
                        <h3 className="card-form__section-title">Notes</h3>

                        <div className="card-form__field">
              <textarea
                  className="card-form__textarea"
                  placeholder="Any additional notes about this card..."
                  {...register('notes')}
              />
                        </div>
                    </div>

                    {/* ── Actions ── */}
                    <div className="card-form__actions">
                        <button
                            type="button"
                            className="card-form__cancel"
                            onClick={() => navigate('/collection')}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="card-form__submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Card'}
                        </button>
                    </div>

                </form>
            </main>
        </div>
    )
}

export default AddCardPage
