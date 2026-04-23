'use client'

import React, { useState } from 'react'
import { Label } from '@/common/ui/label'
import { Badge } from '@/common/ui/badge'
import { IndianRupee, Plus, Pencil, Trash2, Star, Bus, ChevronUp, ChevronDown } from 'lucide-react'
import { Toggle } from '@/common/ui/toggle'
import CustomInput from '@/common/components/composites/CustomInput'
import CustomSelect from '@/common/components/composites/CustomSelect'
import Modal from '@/common/components/composites/Modal'
import { useTripFormStore } from '../../store'
import type { AddOnCategory } from '../../types'

interface PricingStepProps {
  isEditMode?: boolean
}

type PricingTierDraft = { label: string; price: number | ''; description: string }
type StayOptionDraft = { label: string; price: number | ''; description: string }
type TransportDraft = { vehicle: string; price: number | ''; description: string }
type ExtraDraft = {
  label: string
  price: number | ''
  category: 'extra_activity' | 'service' | 'others' | ''
  description: string
}

const VEHICLE_OPTIONS = [
  { value: 'Traveller', label: 'Traveller (Mini Bus)' },
  { value: 'Tempo Traveller', label: 'Tempo Traveller' },
  { value: 'Bike', label: 'Bike / Motorcycle' },
  { value: 'Car', label: 'Car / Hatchback' },
  { value: 'SUV', label: 'SUV / Innova' },
  { value: 'Bus', label: 'Bus' },
  { value: 'Cab', label: 'Cab / Taxi' },
  { value: 'Jeep', label: 'Jeep' },
  { value: 'Others', label: 'Others' },
]

const EXTRA_CATEGORY_OPTIONS = [
  { value: 'extra_activity', label: 'Activity' },
  { value: 'service', label: 'Service' },
  { value: 'others', label: 'Others' },
]

const EMPTY_PRICING_DRAFT: PricingTierDraft = { label: '', price: '', description: '' }
const EMPTY_STAY_DRAFT: StayOptionDraft = { label: '', price: '', description: '' }
const EMPTY_TRANSPORT_DRAFT: TransportDraft = { vehicle: '', price: '', description: '' }
const EMPTY_EXTRA_DRAFT: ExtraDraft = { label: '', price: '', category: 'others', description: '' }

const SectionHeader: React.FC<{
  title: string
  subtitle?: string
  count?: number
  onAdd: () => void
  addLabel?: string
}> = ({ title, subtitle, count, onAdd, addLabel = 'Add' }) => (
  <div className="flex items-start justify-between gap-4">
    <div>
      <h4 className="text-sm font-semibold text-neutral-900">{title}</h4>
      {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
    </div>
    <div className="flex items-center gap-2 shrink-0">
      {count !== undefined && count > 0 && (
        <Badge variant="secondary" className="text-xs">{count}</Badge>
      )}
      <button
        type="button"
        onClick={onAdd}
        className="flex items-center gap-1.5 text-xs text-primary border border-primary/30 rounded-lg px-3 py-1.5 hover:bg-primary/5 transition-colors font-medium"
      >
        <Plus className="w-3.5 h-3.5" />
        {addLabel}
      </button>
    </div>
  </div>
)

const PricingStep: React.FC<PricingStepProps> = () => {
  const {
    pricings, addPricingTier, removePricingTier, updatePricingTier, setDisplayPricingTier, movePricingTier,
    addOns, addAddOn, removeAddOn, updateAddOn, moveAddOn, setDefaultAddOn,
    cancellationPolicy, addRefundTier, removeRefundTier, updateRefundTier,
    isAdvanceBookingAllowed, advanceBookingPrice, closeAdvanceBookingDays, updateField,
  } = useTripFormStore()

  // Pricing tier modal
  const [tierModalOpen, setTierModalOpen] = useState(false)
  const [tierDraft, setTierDraft] = useState<PricingTierDraft>(EMPTY_PRICING_DRAFT)
  const [editTierId, setEditTierId] = useState<number | null>(null)

  // Stay options modal
  const [stayModalOpen, setStayModalOpen] = useState(false)
  const [stayDraft, setStayDraft] = useState<StayOptionDraft>(EMPTY_STAY_DRAFT)
  const [editStayId, setEditStayId] = useState<number | null>(null)

  // Transport modal
  const [transportModalOpen, setTransportModalOpen] = useState(false)
  const [transportDraft, setTransportDraft] = useState<TransportDraft>(EMPTY_TRANSPORT_DRAFT)
  const [editTransportId, setEditTransportId] = useState<number | null>(null)

  // Extras modal
  const [extrasModalOpen, setExtrasModalOpen] = useState(false)
  const [extraDraft, setExtraDraft] = useState<ExtraDraft>(EMPTY_EXTRA_DRAFT)
  const [editExtraId, setEditExtraId] = useState<number | null>(null)

  // Refund tier modal
  const [refundModalOpen, setRefundModalOpen] = useState(false)
  const [refundDays, setRefundDays] = useState<number | ''>('')
  const [refundPct, setRefundPct] = useState<number | ''>('')

  // Derived groups - include addOns without category as "others"
  const stayAddOns = addOns.filter((a) => a.category === 'room_upgrade')
  const transportAddOns = addOns.filter((a) => a.category === 'bike_upgrade')
  const extraAddOns = addOns.filter(
    (a) => !a.category || a.category === 'extra_activity' || a.category === 'service' || a.category === 'others',
  )

  // ── Pricing tier handlers ──────────────────────────────────────────────────
  const openAddTierModal = () => { setEditTierId(null); setTierDraft(EMPTY_PRICING_DRAFT); setTierModalOpen(true) }
  const openEditTierModal = (id: number) => {
    const tier = pricings.find((t) => t.id === id)
    if (!tier) return
    setEditTierId(id)
    setTierDraft({ label: tier.label, price: tier.pricePerPerson, description: tier.description ?? '' })
    setTierModalOpen(true)
  }
  const handleSaveTier = () => {
    const price = typeof tierDraft.price === 'number' ? tierDraft.price : 0
    if (!tierDraft.label.trim() || price < 0) return
    if (editTierId !== null) {
      updatePricingTier(editTierId, 'label', tierDraft.label.trim())
      updatePricingTier(editTierId, 'pricePerPerson', price)
      updatePricingTier(editTierId, 'description', tierDraft.description || undefined)
    } else {
      addPricingTier(tierDraft.label.trim(), price, tierDraft.description.trim() || undefined)
    }
    setTierModalOpen(false)
  }

  // ── Stay option handlers ───────────────────────────────────────────────────
  const openAddStayModal = () => { setEditStayId(null); setStayDraft(EMPTY_STAY_DRAFT); setStayModalOpen(true) }
  const openEditStayModal = (id: number) => {
    const addon = addOns.find((a) => a.id === id)
    if (!addon) return
    setEditStayId(id)
    setStayDraft({ label: addon.label, price: addon.pricePerPerson, description: addon.description ?? '' })
    setStayModalOpen(true)
  }
  const handleSaveStay = () => {
    const price = typeof stayDraft.price === 'number' ? stayDraft.price : 0
    if (!stayDraft.label.trim() || price < 0) return
    if (editStayId !== null) {
      updateAddOn(editStayId, 'label', stayDraft.label.trim())
      updateAddOn(editStayId, 'pricePerPerson', price)
      updateAddOn(editStayId, 'description', stayDraft.description || undefined)
    } else {
      addAddOn(stayDraft.label.trim(), price, 'room_upgrade', stayDraft.description.trim() || undefined)
    }
    setStayModalOpen(false)
  }

  // ── Transport handlers ─────────────────────────────────────────────────────
  const openAddTransportModal = () => { setEditTransportId(null); setTransportDraft(EMPTY_TRANSPORT_DRAFT); setTransportModalOpen(true) }
  const openEditTransportModal = (id: number) => {
    const addon = addOns.find((a) => a.id === id)
    if (!addon) return
    setEditTransportId(id)
    setTransportDraft({ vehicle: addon.label, price: addon.pricePerPerson, description: addon.description ?? '' })
    setTransportModalOpen(true)
  }
  const handleSaveTransport = () => {
    const price = typeof transportDraft.price === 'number' ? transportDraft.price : 0
    if (!transportDraft.vehicle || price < 0) return
    if (editTransportId !== null) {
      updateAddOn(editTransportId, 'label', transportDraft.vehicle)
      updateAddOn(editTransportId, 'pricePerPerson', price)
      updateAddOn(editTransportId, 'description', transportDraft.description || undefined)
    } else {
      addAddOn(transportDraft.vehicle, price, 'bike_upgrade', transportDraft.description.trim() || undefined)
    }
    setTransportModalOpen(false)
  }

  // ── Extras handlers ────────────────────────────────────────────────────────
  const openAddExtraModal = () => { setEditExtraId(null); setExtraDraft(EMPTY_EXTRA_DRAFT); setExtrasModalOpen(true) }
  const openEditExtraModal = (id: number) => {
    const addon = addOns.find((a) => a.id === id)
    if (!addon) return
    setEditExtraId(id)
    setExtraDraft({
      label: addon.label,
      price: addon.pricePerPerson,
      category: (addon.category as ExtraDraft['category']) || 'others',
      description: addon.description ?? '',
    })
    setExtrasModalOpen(true)
  }
  const handleSaveExtra = () => {
    const price = typeof extraDraft.price === 'number' ? extraDraft.price : 0
    const category = extraDraft.category || 'others'
    if (!extraDraft.label.trim() || price < 0) return
    if (editExtraId !== null) {
      updateAddOn(editExtraId, 'label', extraDraft.label.trim())
      updateAddOn(editExtraId, 'pricePerPerson', price)
      updateAddOn(editExtraId, 'category', category as AddOnCategory)
      updateAddOn(editExtraId, 'description', extraDraft.description || undefined)
    } else {
      addAddOn(extraDraft.label.trim(), price, category as AddOnCategory, extraDraft.description.trim() || undefined)
    }
    setExtrasModalOpen(false)
  }

  // ── Refund tier handlers ───────────────────────────────────────────────────
  const handleSaveRefundTier = () => {
    const days = typeof refundDays === 'number' ? refundDays : -1
    const pct = typeof refundPct === 'number' ? refundPct : -1
    if (days < 0 || pct < 0 || pct > 100) return
    if (cancellationPolicy.some((t) => t.daysBeforeCancellation === days)) return
    addRefundTier(days, pct)
    setRefundDays('')
    setRefundPct('')
    setRefundModalOpen(false)
  }

  return (
    <div className="space-y-10 max-w-3xl">

      {/* ── Pricing Tiers ──────────────────────────────────────────────────── */}
      <section className="space-y-4">
        <SectionHeader
          title="Pricing Tiers"
          subtitle="Define tiers like Double Sharing, Triple Sharing, etc."
          count={pricings.length}
          onAdd={openAddTierModal}
          addLabel="Add Tier"
        />
        {pricings.length > 0 ? (
          <div className="space-y-2">
            {pricings.map((tier, index) => (
              <div
                key={tier.id}
                className={`flex items-center justify-between rounded-xl border px-4 py-3 bg-white ${
                  index === 0 ? 'border-primary/40 ring-1 ring-primary/20' : 'border-neutral-200'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Reorder arrows */}
                  <div className="flex flex-col shrink-0">
                    <button type="button" onClick={() => movePricingTier(tier.id, 'up')} disabled={index === 0}
                      className="text-neutral-300 hover:text-neutral-600 disabled:opacity-0 transition-colors">
                      <ChevronUp className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => movePricingTier(tier.id, 'down')} disabled={index === pricings.length - 1}
                      className="text-neutral-300 hover:text-neutral-600 disabled:opacity-0 transition-colors">
                      <ChevronDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {index === 0 && <Star className="w-3.5 h-3.5 text-primary shrink-0" />}
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">{tier.label}</p>
                    {tier.description && (
                      <p className="text-xs text-muted-foreground truncate">{tier.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className="text-sm font-semibold text-neutral-800 flex items-center gap-0.5">
                    <IndianRupee className="w-3.5 h-3.5" />{tier.pricePerPerson.toLocaleString('en-IN')}
                  </span>
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => setDisplayPricingTier(tier.id)}
                      className="text-xs text-primary/80 hover:text-primary border border-primary/20 rounded-md px-2 py-0.5 transition-colors"
                    >
                      Set Default
                    </button>
                  )}
                  <button type="button" onClick={() => openEditTierModal(tier.id)}
                    className="text-neutral-400 hover:text-neutral-700 transition-colors p-1">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => removePricingTier(tier.id)}
                    className="text-neutral-400 hover:text-red-500 transition-colors p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-neutral-200 py-6 text-center">
            <p className="text-sm text-muted-foreground">No pricing tiers yet</p>
            <p className="text-xs text-muted-foreground mt-0.5">Add at least one, e.g. Double Sharing</p>
          </div>
        )}
      </section>      

      {/* ── Add-ons ──────────────────────────────────────────────────────────── */}
      <section className="space-y-5 pt-8 border-t border-neutral-100">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Add-ons</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Optional extras travellers can purchase. None are required.</p>
        </div>

        {/* Stay Options (room_upgrade) */}
        <div className="rounded-2xl border border-neutral-100 bg-neutral-50/40 p-4 space-y-3">
          <SectionHeader
            title="Stay Options"
            subtitle="Room upgrades like single occupancy, private cottage, etc."
            count={stayAddOns.length}
            onAdd={openAddStayModal}
            addLabel="Add"
          />
          {stayAddOns.length > 0 && (
            <div className="space-y-2 mt-2">
              {stayAddOns.map((addon, index) => (
                <div key={addon.id} className={`flex items-center justify-between bg-white rounded-lg border px-3 py-2.5 ${
                  index === 0 ? 'border-primary/30 ring-1 ring-primary/10' : 'border-neutral-200'
                }`}>
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Reorder arrows */}
                    <div className="flex flex-col shrink-0">
                      <button type="button" onClick={() => moveAddOn(addon.id, 'up')} disabled={index === 0}
                        className="text-neutral-300 hover:text-neutral-600 disabled:opacity-0 transition-colors">
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => moveAddOn(addon.id, 'down')} disabled={index === stayAddOns.length - 1}
                        className="text-neutral-300 hover:text-neutral-600 disabled:opacity-0 transition-colors">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {index === 0 && <Star className="w-3 h-3 text-primary shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">{addon.label}</p>
                      {addon.description && (
                        <p className="text-xs text-muted-foreground truncate">{addon.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    <span className="text-sm font-semibold text-neutral-800 flex items-center gap-0.5">
                      <IndianRupee className="w-3.5 h-3.5" />{addon.pricePerPerson.toLocaleString('en-IN')}
                    </span>
                    {index !== 0 && (
                      <button type="button" onClick={() => setDefaultAddOn(addon.id)}
                        className="text-xs text-primary/80 hover:text-primary border border-primary/20 rounded-md px-2 py-0.5 transition-colors">
                        Set Default
                      </button>
                    )}
                    <button type="button" onClick={() => openEditStayModal(addon.id)}
                      className="text-neutral-400 hover:text-neutral-700 p-1 transition-colors">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => removeAddOn(addon.id)}
                      className="text-neutral-400 hover:text-red-500 p-1 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Transport (bike_upgrade) */}
        <div className="rounded-2xl border border-neutral-100 bg-neutral-50/40 p-4 space-y-3">
          <SectionHeader
            title="Transport"
            subtitle="Bike rental, cab, traveller or other vehicle options."
            count={transportAddOns.length}
            onAdd={openAddTransportModal}
            addLabel="Add"
          />
          {transportAddOns.length > 0 && (
            <div className="space-y-2 mt-2">
              {transportAddOns.map((addon, index) => {
                const vehicleLabel = VEHICLE_OPTIONS.find((v) => v.value === addon.label)?.label ?? addon.label
                return (
                  <div key={addon.id} className={`flex items-center justify-between bg-white rounded-lg border px-3 py-2.5 ${
                    index === 0 ? 'border-primary/30 ring-1 ring-primary/10' : 'border-neutral-200'
                  }`}>
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Reorder arrows */}
                      <div className="flex flex-col shrink-0">
                        <button type="button" onClick={() => moveAddOn(addon.id, 'up')} disabled={index === 0}
                          className="text-neutral-300 hover:text-neutral-600 disabled:opacity-0 transition-colors">
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" onClick={() => moveAddOn(addon.id, 'down')} disabled={index === transportAddOns.length - 1}
                          className="text-neutral-300 hover:text-neutral-600 disabled:opacity-0 transition-colors">
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {index === 0 && <Star className="w-3 h-3 text-primary shrink-0" />}
                      <Bus className="w-4 h-4 text-neutral-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">{vehicleLabel}</p>
                        {addon.description && (
                          <p className="text-xs text-muted-foreground truncate">{addon.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <span className="text-sm font-semibold text-neutral-800 flex items-center gap-0.5">
                        <IndianRupee className="w-3.5 h-3.5" />{addon.pricePerPerson.toLocaleString('en-IN')}
                      </span>
                      {index !== 0 && (
                        <button type="button" onClick={() => setDefaultAddOn(addon.id)}
                          className="text-xs text-primary/80 hover:text-primary border border-primary/20 rounded-md px-2 py-0.5 transition-colors">
                          Set Default
                        </button>
                      )}
                      <button type="button" onClick={() => openEditTransportModal(addon.id)}
                        className="text-neutral-400 hover:text-neutral-700 p-1 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => removeAddOn(addon.id)}
                        className="text-neutral-400 hover:text-red-500 p-1 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Extras (activity / service / others) */}
        <div className="rounded-2xl border border-neutral-100 bg-neutral-50/40 p-4 space-y-3">
          <SectionHeader
            title="Extras"
            subtitle="Activities, services, or any other optional add-on."
            count={extraAddOns.length}
            onAdd={openAddExtraModal}
            addLabel="Add"
          />
          {extraAddOns.length > 0 && (
            <div className="space-y-2 mt-2">
              {extraAddOns.map((addon, index) => {
                const displayCategory = addon.category || 'others'
                const catLabel = EXTRA_CATEGORY_OPTIONS.find((c) => c.value === displayCategory)?.label ?? 'Others'
                return (
                  <div key={addon.id} className="flex items-center justify-between bg-white rounded-lg border border-neutral-200 px-3 py-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Reorder arrows */}
                      <div className="flex flex-col shrink-0">
                        <button type="button" onClick={() => moveAddOn(addon.id, 'up')} disabled={index === 0}
                          className="text-neutral-300 hover:text-neutral-600 disabled:opacity-0 transition-colors">
                          <ChevronUp className="w-3.5 h-3.5" />
                        </button>
                        <button type="button" onClick={() => moveAddOn(addon.id, 'down')} disabled={index === extraAddOns.length - 1}
                          className="text-neutral-300 hover:text-neutral-600 disabled:opacity-0 transition-colors">
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-neutral-900 truncate">{addon.label}</p>
                          <Badge variant="outline" className="text-xs shrink-0">{catLabel}</Badge>
                        </div>
                        {addon.description && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{addon.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-3">
                      <span className="text-sm font-semibold text-neutral-800 flex items-center gap-0.5">
                        <IndianRupee className="w-3.5 h-3.5" />{addon.pricePerPerson.toLocaleString('en-IN')}
                      </span>
                      <button type="button" onClick={() => openEditExtraModal(addon.id)}
                        className="text-neutral-400 hover:text-neutral-700 p-1 transition-colors">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button type="button" onClick={() => removeAddOn(addon.id)}
                        className="text-neutral-400 hover:text-red-500 p-1 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── Advance Booking ─────────────────────────────────────────────────── */}
      <section className="space-y-4 pt-8 border-t border-neutral-100">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900">Advance Booking</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Let travellers reserve a spot by paying a deposit.</p>
        </div>
        <div className="flex items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50/60 px-4 py-3">
          <div>
            <Label className="text-sm font-medium">Enable Advance Booking</Label>
            <p className="text-xs text-muted-foreground mt-0.5">Travellers pay a deposit to secure their spot</p>
          </div>
          <Toggle
            checked={isAdvanceBookingAllowed}
            onCheckedChange={(val) => updateField('isAdvanceBookingAllowed', val)}
            checkedLabel="Yes"
            uncheckedLabel="No"
          />
        </div>
        {isAdvanceBookingAllowed && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-1">
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-600">Deposit amount (% of total price)</Label>
              <CustomInput
                type="number" min="1" max="100" placeholder="e.g., 20"
                value={advanceBookingPrice || ''}
                onChange={(e) => updateField('advanceBookingPrice', e.target.value ? Number(e.target.value) : 0)}
                variant="input"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-neutral-600">Close advance booking (days before trip)</Label>
              <CustomInput
                type="number" min="0" placeholder="e.g., 7"
                value={closeAdvanceBookingDays || ''}
                onChange={(e) => updateField('closeAdvanceBookingDays', e.target.value ? Number(e.target.value) : 0)}
                variant="input"
              />
            </div>
          </div>
        )}
      </section>

      {/* ── Cancellation Policy ──────────────────────────────────────────────── */}
      <section className="space-y-4 pt-8 border-t border-neutral-100">
        <SectionHeader
          title="Cancellation Policy"
          subtitle="Refund tiers based on how far in advance a traveller cancels."
          count={cancellationPolicy.length}
          onAdd={() => { setRefundDays(''); setRefundPct(''); setRefundModalOpen(true) }}
          addLabel="Add Tier"
        />
        {cancellationPolicy.length > 0 ? (
          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="text-left text-xs font-medium text-neutral-500 px-4 py-2.5">Days before trip</th>
                  <th className="text-left text-xs font-medium text-neutral-500 px-4 py-2.5">Refund %</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody>
                {[...cancellationPolicy]
                  .sort((a, b) => b.daysBeforeCancellation - a.daysBeforeCancellation)
                  .map((tier) => (
                    <tr key={tier.id} className="border-b border-neutral-100 last:border-0">
                      <td className="px-4 py-3">
                        <CustomInput type="number" min="0" placeholder="30"
                          value={tier.daysBeforeCancellation}
                          onChange={(e) => updateRefundTier(tier.id, 'daysBeforeCancellation', e.target.value ? Number(e.target.value) : 0)}
                          variant="input" />
                      </td>
                      <td className="px-4 py-3">
                        <CustomInput type="number" min="0" max="100" placeholder="80"
                          value={tier.refundPercentage}
                          onChange={(e) => updateRefundTier(tier.id, 'refundPercentage', e.target.value ? Math.min(100, Number(e.target.value)) : 0)}
                          variant="input" />
                      </td>
                      <td className="pr-3 py-3">
                        <button type="button" onClick={() => removeRefundTier(tier.id)}
                          className="text-neutral-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-neutral-200 py-5 text-center">
            <p className="text-sm text-muted-foreground">No refund tiers defined</p>
            <p className="text-xs text-muted-foreground mt-0.5">Example: cancel 30 days before → 80% refund</p>
          </div>
        )}
      </section>

      {/* ═══════════════ MODALS ═══════════════ */}

      {/* Pricing Tier Modal */}
      <Modal
        open={tierModalOpen} onClose={() => setTierModalOpen(false)}
        title={editTierId ? 'Edit Pricing Tier' : 'Add Pricing Tier'}
        submitText={editTierId ? 'Save Changes' : 'Add Tier'}
        onSubmit={handleSaveTier}
        disabled={!tierDraft.label.trim() || tierDraft.price === '' || (tierDraft.price as number) < 0}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm">Label <span className="text-red-500">*</span></Label>
            <CustomInput placeholder="e.g., Double Sharing" value={tierDraft.label}
              onChange={(e) => setTierDraft((d) => ({ ...d, label: e.target.value }))} variant="input" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5" /> Price per Person <span className="text-red-500">*</span>
            </Label>
            <CustomInput type="number" min="0" placeholder="8500"
              value={tierDraft.price === '' ? '' : tierDraft.price}
              onChange={(e) => setTierDraft((d) => ({ ...d, price: e.target.value ? Number(e.target.value) : '' }))}
              variant="input" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Description <span className="text-neutral-400 font-normal">(optional)</span></Label>
            <CustomInput placeholder="e.g., Private room with en-suite bathroom" value={tierDraft.description}
              onChange={(e) => setTierDraft((d) => ({ ...d, description: e.target.value }))} variant="input" />
          </div>
        </div>
      </Modal>

      {/* Stay Option Modal */}
      <Modal
        open={stayModalOpen} onClose={() => setStayModalOpen(false)}
        title={editStayId ? 'Edit Stay Option' : 'Add Stay Option'}
        submitText={editStayId ? 'Save Changes' : 'Add Option'}
        onSubmit={handleSaveStay}
        disabled={!stayDraft.label.trim() || stayDraft.price === '' || (stayDraft.price as number) < 0}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm">Option Name <span className="text-red-500">*</span></Label>
            <CustomInput placeholder="e.g., Single Occupancy, Private Cottage" value={stayDraft.label}
              onChange={(e) => setStayDraft((d) => ({ ...d, label: e.target.value }))} variant="input" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5" /> Price per Person <span className="text-red-500">*</span>
            </Label>
            <CustomInput type="number" min="0" placeholder="2000"
              value={stayDraft.price === '' ? '' : stayDraft.price}
              onChange={(e) => setStayDraft((d) => ({ ...d, price: e.target.value ? Number(e.target.value) : '' }))}
              variant="input" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Description <span className="text-neutral-400 font-normal">(optional)</span></Label>
            <CustomInput placeholder="e.g., Private room with mountain view" value={stayDraft.description}
              onChange={(e) => setStayDraft((d) => ({ ...d, description: e.target.value }))} variant="textarea" rows={2} />
          </div>
        </div>
      </Modal>

      {/* Transport Modal */}
      <Modal
        open={transportModalOpen} onClose={() => setTransportModalOpen(false)}
        title={editTransportId ? 'Edit Transport Option' : 'Add Transport Option'}
        submitText={editTransportId ? 'Save Changes' : 'Add Vehicle'}
        onSubmit={handleSaveTransport}
        disabled={!transportDraft.vehicle || transportDraft.price === '' || (transportDraft.price as number) < 0}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm">Vehicle Type <span className="text-red-500">*</span></Label>
            <CustomSelect value={transportDraft.vehicle}
              onChange={(val) => setTransportDraft((d) => ({ ...d, vehicle: val }))}
              placeholder="Select vehicle" options={VEHICLE_OPTIONS} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5" /> Price per Person <span className="text-red-500">*</span>
            </Label>
            <CustomInput type="number" min="0" placeholder="500"
              value={transportDraft.price === '' ? '' : transportDraft.price}
              onChange={(e) => setTransportDraft((d) => ({ ...d, price: e.target.value ? Number(e.target.value) : '' }))}
              variant="input" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Notes <span className="text-neutral-400 font-normal">(optional)</span></Label>
            <CustomInput placeholder="e.g., Pickup from railway station included" value={transportDraft.description}
              onChange={(e) => setTransportDraft((d) => ({ ...d, description: e.target.value }))} variant="textarea" rows={2} />
          </div>
        </div>
      </Modal>

      {/* Extras Modal */}
      <Modal
        open={extrasModalOpen} onClose={() => setExtrasModalOpen(false)}
        title={editExtraId ? 'Edit Extra' : 'Add Extra'}
        submitText={editExtraId ? 'Save Changes' : 'Add Extra'}
        onSubmit={handleSaveExtra}
        disabled={!extraDraft.label.trim() || extraDraft.price === '' || (extraDraft.price as number) < 0}
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm">Name <span className="text-red-500">*</span></Label>
            <CustomInput placeholder="e.g., Paragliding, Photography session" value={extraDraft.label}
              onChange={(e) => setExtraDraft((d) => ({ ...d, label: e.target.value }))} variant="input" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Category <span className="text-neutral-400 font-normal">(optional)</span></Label>
            <CustomSelect value={extraDraft.category}
              onChange={(val) => setExtraDraft((d) => ({ ...d, category: val as ExtraDraft['category'] }))}
              placeholder="Select category" options={EXTRA_CATEGORY_OPTIONS} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm flex items-center gap-1">
              <IndianRupee className="w-3.5 h-3.5" /> Price per Person <span className="text-red-500">*</span>
            </Label>
            <CustomInput type="number" min="0" placeholder="1500"
              value={extraDraft.price === '' ? '' : extraDraft.price}
              onChange={(e) => setExtraDraft((d) => ({ ...d, price: e.target.value ? Number(e.target.value) : '' }))}
              variant="input" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-sm">Description <span className="text-neutral-400 font-normal">(optional)</span></Label>
            <CustomInput placeholder="Short description of this add-on" value={extraDraft.description}
              onChange={(e) => setExtraDraft((d) => ({ ...d, description: e.target.value }))} variant="textarea" rows={2} />
          </div>
        </div>
      </Modal>

      {/* Refund Tier Modal */}
      <Modal
        open={refundModalOpen} onClose={() => setRefundModalOpen(false)}
        title="Add Refund Tier" submitText="Add Tier"
        onSubmit={handleSaveRefundTier}
        disabled={refundDays === '' || refundPct === '' || (refundPct as number) > 100}
      >
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Example: if cancelled <strong>30 days</strong> before the trip → <strong>80% refund</strong>
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-sm">Days before trip <span className="text-red-500">*</span></Label>
              <CustomInput type="number" min="0" placeholder="30"
                value={refundDays === '' ? '' : refundDays}
                onChange={(e) => setRefundDays(e.target.value ? Number(e.target.value) : '')} variant="input" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Refund % <span className="text-red-500">*</span></Label>
              <CustomInput type="number" min="0" max="100" placeholder="80"
                value={refundPct === '' ? '' : refundPct}
                onChange={(e) => setRefundPct(e.target.value ? Math.min(100, Number(e.target.value)) : '')} variant="input" />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default PricingStep
