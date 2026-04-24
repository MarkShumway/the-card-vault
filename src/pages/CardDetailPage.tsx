import { useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    useGetCardByIdQuery,
    useUpdateCardMutation,
    useDeleteCardMutation,
    useUploadCardImageMutation,
} from '../features/cards/cardsApi'
import { useAppSelector } from '../store/hooks'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import EbayPricing from '../features/cards/components/EbayPricing'
import type { CardCategory, CardCondition } from '../types'
import {formatCurrency, formatPercent, calcProfit, formatDate} from '../utils/formatters'
import * as React from "react";

// ─── Zod schema ───────────────────────────────────────────────────────────────
const editSchema = z.object({
    player_name: z.string().min(1, 'Player name is required'),
    year: z
        .number({ error: 'Year is required' })
        .int()
        .min(1800, 'Year must be 1800 or later')
        .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
    brand: z.string().min(1, 'Brand is required'),
    series: z.string().optional(),
    card_number: z.string().optional(),
    category: z.enum([
        'baseball', 'hockey', 'football', 'basketball',
        'soccer', 'golf', 'tennis', 'wrestling',
        'pokemon', 'magic', 'yugioh', 'other'
    ]),
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

type EditFormValues = z.infer<typeof editSchema>

// ─── Component ────────────────────────────────────────────────────────────────
function CardDetailPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const { user } = useAppSelector((state) => state.auth)

    const { data: card, isLoading, isError } = useGetCardByIdQuery(id ?? '')
    const [updateCard, { isLoading: isUpdating }] = useUpdateCardMutation()
    const [deleteCard, { isLoading: isDeleting }] = useDeleteCardMutation()
    const [uploadImage, { isLoading: isUploading }] = useUploadCardImageMutation()

    const [isEditing, setIsEditing] = useState(false)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [serverError, setServerError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<EditFormValues>({
        resolver: zodResolver(editSchema),
    })

    if (isLoading) {
        return (
            <div className="card-detail-page">
                <Header />
                <div className="card-detail-page__loading">Loading card...</div>
            </div>
        )
    }

    if (isError || !card) {
        return (
            <div className="card-detail-page">
                <Header />
                <div className="card-detail-page__error">Card not found.</div>
            </div>
        )
    }

    const { profit, percent } = calcProfit(card.purchase_price, card.current_value)
    const isProfit = profit >= 0

    const handleEditStart = () => {
        reset({
            player_name: card.player_name,
            year: card.year,
            brand: card.brand,
            series: card.series ?? '',
            card_number: card.card_number ?? '',
            category: card.category as CardCategory,
            condition: card.condition as CardCondition,
            purchase_price: card.purchase_price,
            current_value: card.current_value,
            notes: card.notes ?? '',
        })
        setIsEditing(true)
    }

    const handleEditCancel = () => {
        setIsEditing(false)
        setImageFile(null)
        setImagePreview(null)
        setServerError(null)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setImageFile(file)
        setImagePreview(URL.createObjectURL(file))
    }

    const handleDelete = async () => {
        if (!window.confirm(`Permanently delete ${card.player_name}?`)) return
        await deleteCard(card.id)
        navigate('/collection')
    }

    const onSubmit = async (values: EditFormValues) => {
        if (!user) return
        setServerError(null)

        try {
            let image_url = card.image_url

            if (imageFile) {
                image_url = await uploadImage({
                    userId: user.id,
                    file: imageFile,
                }).unwrap()
            }

            await updateCard({
                id: card.id,
                updates: {
                    player_name: values.player_name,
                    year: values.year,
                    brand: values.brand,
                    series: values.series ?? null,
                    card_number: values.card_number ?? null,
                    category: values.category as CardCategory,
                    condition: values.condition as CardCondition,
                    purchase_price: values.purchase_price,
                    current_value: values.current_value,
                    notes: values.notes ?? null,
                    image_url,
                },
            }).unwrap()

            setIsEditing(false)
            setImageFile(null)
            setImagePreview(null)
        } catch {
            setServerError('Something went wrong saving your changes. Please try again.')
        }
    }

    const isSubmitting = isUpdating || isUploading
    const displayImage = imagePreview ?? card.image_url

    // ─── View mode ───────────────────────────────────────────────────────────────
    if (!isEditing) {
        return (
            <div className="card-detail-page">
                <Header />
                <main className="card-detail-page__main">

                    <button
                        className="card-detail-page__back"
                        onClick={() => navigate('/collection')}
                    >
                        ← Back to Collection
                    </button>

                    <div className="card-detail-page__layout">
                        {/* Image column */}
                        <div className="card-detail-page__image-col">
                            {card.image_url ? (
                                <img
                                    className="card-detail-page__image"
                                    src={card.image_url}
                                    alt={card.player_name}
                                />
                            ) : (
                                <div className="card-detail-page__image-placeholder">
                                    <span>{card.player_name.charAt(0)}</span>
                                </div>
                            )}
                        </div>

                        {/* Info column */}
                        <div className="card-detail-page__info-col">
                            <div className="card-detail-page__title-row">
                                <h2 className="card-detail-page__player-name">
                                    {card.player_name}
                                </h2>
                                <div className="card-detail-page__badges">
                                    <span className="card-detail-page__badge card-detail-page__badge--category">
                                        {card.category}
                                    </span>
                                    <span className="card-detail-page__badge card-detail-page__badge--condition">
                                        {card.condition}
                                    </span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="card-detail-page__stats">
                                <div className="card-detail-page__stat">
                                    <span className="card-detail-page__stat-label">Paid</span>
                                    <span className="card-detail-page__stat-value">
                                        {formatCurrency(card.purchase_price)}
                                    </span>
                                </div>
                                <div className="card-detail-page__stat">
                                    <span className="card-detail-page__stat-label">Value</span>
                                    <span className="card-detail-page__stat-value">
                                        {formatCurrency(card.current_value)}
                                    </span>
                                </div>
                                <div className="card-detail-page__stat">
                                    <span className="card-detail-page__stat-label">P&L</span>
                                    <span className={`card-detail-page__stat-value card-detail-page__stat-value--${isProfit ? 'profit' : 'loss'}`}>
                                        {formatCurrency(profit)}
                                        <br />
                                        <small>({formatPercent(percent)})</small>
                                    </span>
                                </div>
                            </div>

                            {/* Details */}
                            <div className="card-detail-page__details">
                                <h3 className="card-detail-page__details-title">Card Details</h3>
                                <div className="card-detail-page__details-grid">
                                    <div className="card-detail-page__detail-item">
                                        <span className="card-detail-page__detail-label">Year</span>
                                        <span className="card-detail-page__detail-value">{card.year}</span>
                                    </div>
                                    <div className="card-detail-page__detail-item">
                                        <span className="card-detail-page__detail-label">Brand</span>
                                        <span className="card-detail-page__detail-value">{card.brand}</span>
                                    </div>
                                    <div className="card-detail-page__detail-item">
                                        <span className="card-detail-page__detail-label">Series</span>
                                        <span className="card-detail-page__detail-value">
                                            {card.series ?? '—'}
                                        </span>
                                    </div>
                                    <div className="card-detail-page__detail-item">
                                        <span className="card-detail-page__detail-label">Card Number</span>
                                        <span className="card-detail-page__detail-value">
                                            {card.card_number ? `#${card.card_number}` : '—'}
                                        </span>
                                    </div>
                                    <div className="card-detail-page__detail-item">
                                        <span className="card-detail-page__detail-label">Added</span>
                                        <span className="card-detail-page__detail-value">
                                            {formatDate(card.created_at)}
                                        </span>
                                    </div>
                                    <div className="card-detail-page__detail-item">
                                        <span className="card-detail-page__detail-label">Last Updated</span>
                                        <span className="card-detail-page__detail-value">
                                            {formatDate(card.updated_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Notes */}
                            {card.notes && (
                                <div className="card-detail-page__notes">
                                    <h3 className="card-detail-page__notes-title">Notes</h3>
                                    <p className="card-detail-page__notes-text">{card.notes}</p>
                                </div>
                            )}

                            {/* eBay Pricing */}
                            <EbayPricing card={card} />

                            {/* Actions */}
                            <div className="card-detail-page__actions">
                                <button
                                    className="card-detail-page__edit-btn"
                                    onClick={handleEditStart}
                                >
                                    Edit Card
                                </button>
                                <button
                                    className="card-detail-page__delete-btn"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Card'}
                                </button>
                            </div>

                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        )
    }

    // ─── Edit mode ───────────────────────────────────────────────────────────────
    return (
        <div className="card-detail-page">
            <Header />
            <main className="card-detail-page__main">
                <button
                    className="card-detail-page__back"
                    onClick={handleEditCancel}
                >
                    ← Cancel Editing
                </button>

                <h2 className="add-card-page__heading">Edit Card</h2>

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
                                <label className="card-form__label">Name <span>*</span></label>
                                <input
                                    className={`card-form__input${errors.player_name ? ' card-form__input--error' : ''}`}
                                    {...register('player_name')}
                                />
                                {errors.player_name && (
                                    <span className="card-form__error">{errors.player_name.message}</span>
                                )}
                            </div>
                            <div className="card-form__field">
                                <label className="card-form__label">
                                    Category <span>*</span>
                                </label>
                                <select
                                    className="card-form__select"
                                    {...register('category')}
                                >
                                    <optgroup label="Sports">
                                        <option value="baseball">Baseball</option>
                                        <option value="basketball">Basketball</option>
                                        <option value="football">Football</option>
                                        <option value="golf">Golf</option>
                                        <option value="hockey">Hockey</option>
                                        <option value="soccer">Soccer</option>
                                        <option value="tennis">Tennis</option>
                                        <option value="wrestling">Wrestling</option>
                                    </optgroup>
                                    <optgroup label="Trading Cards">
                                        <option value="pokemon">Pokémon</option>
                                        <option value="magic">Magic: The Gathering</option>
                                        <option value="yugioh">Yu-Gi-Oh!</option>
                                    </optgroup>
                                    <optgroup label="Other">
                                        <option value="other">Other</option>
                                    </optgroup>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* ── Card Details ── */}
                    <div className="card-form__section">
                        <h3 className="card-form__section-title">Card Details</h3>
                        <div className="card-form__row card-form__row--three">
                            <div className="card-form__field">
                                <label className="card-form__label">Year <span>*</span></label>
                                <input
                                    className={`card-form__input${errors.year ? ' card-form__input--error' : ''}`}
                                    type="number"
                                    {...register('year', { valueAsNumber: true })}
                                />
                                {errors.year && (
                                    <span className="card-form__error">{errors.year.message}</span>
                                )}
                            </div>
                            <div className="card-form__field">
                                <label className="card-form__label">Brand <span>*</span></label>
                                <input
                                    className={`card-form__input${errors.brand ? ' card-form__input--error' : ''}`}
                                    {...register('brand')}
                                />
                                {errors.brand && (
                                    <span className="card-form__error">{errors.brand.message}</span>
                                )}
                            </div>
                            <div className="card-form__field">
                                <label className="card-form__label">Series</label>
                                <input className="card-form__input" {...register('series')} />
                            </div>
                        </div>

                        <div className="card-form__row">
                            <div className="card-form__field">
                                <label className="card-form__label">Card Number</label>
                                <input className="card-form__input" {...register('card_number')} />
                            </div>
                            <div className="card-form__field">
                                <label className="card-form__label">Condition <span>*</span></label>
                                <select className="card-form__select" {...register('condition')}>
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
                                <label className="card-form__label">Purchase Price ($) <span>*</span></label>
                                <input
                                    className={`card-form__input${errors.purchase_price ? ' card-form__input--error' : ''}`}
                                    type="number"
                                    step="0.01"
                                    {...register('purchase_price', { valueAsNumber: true })}
                                />
                                {errors.purchase_price && (
                                    <span className="card-form__error">{errors.purchase_price.message}</span>
                                )}
                            </div>
                            <div className="card-form__field">
                                <label className="card-form__label">Current Value ($) <span>*</span></label>
                                <input
                                    className={`card-form__input${errors.current_value ? ' card-form__input--error' : ''}`}
                                    type="number"
                                    step="0.01"
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
                            {displayImage ? (
                                <img
                                    className="card-form__image-preview"
                                    src={displayImage}
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
                            <button
                                type="button"
                                className="card-form__cancel"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                {displayImage ? 'Change Image' : 'Upload Image'}
                            </button>
                        </div>
                    </div>

                    {/* ── Notes ── */}
                    <div className="card-form__section">
                        <h3 className="card-form__section-title">Notes</h3>
                        <div className="card-form__field">
                            <textarea className="card-form__textarea"
                                {...register('notes')}
                            />
                        </div>
                    </div>

                    {/* ── Actions ── */}
                    <div className="card-form__actions">
                        <button
                            type="button"
                            className="card-form__cancel"
                            onClick={handleEditCancel}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="card-form__submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </main>

            <Footer />
        </div>
    )
}

export default CardDetailPage
