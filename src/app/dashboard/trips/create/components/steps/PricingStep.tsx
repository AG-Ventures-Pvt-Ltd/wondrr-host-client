'use client'

import React, { useState } from 'react'
import { Label } from '@/common/ui/label'
import { Badge } from '@/common/ui/badge'
import { IndianRupee, Plus, Trash2, Star } from 'lucide-react'
import { Toggle } from '@/common/ui/toggle'
import CustomInput from '@/common/components/composites/CustomInput'
// import CustomSelect from '@/common/components/composites/CustomSelect'
import { useTripFormStore } from '../../store'
// import { ADD_ON_CATEGORIES } from '../../constants'

interface PricingStepProps {
  isEditMode?: boolean
}

const PricingStep: React.FC<PricingStepProps> = () => {
  const { pricings, addPricingTier, removePricingTier, updatePricingTier, setDisplayPricingTier, addOns, addAddOn, removeAddOn, updateAddOn, cancellationPolicy, addRefundTier, removeRefundTier, updateRefundTier, isAdvanceBookingAllowed, advanceBookingPrice, closeAdvanceBookingDays, updateField } = useTripFormStore()

  // New pricing tier form state
  const [newTierLabel, setNewTierLabel] = useState('')
  const [newTierPrice, setNewTierPrice] = useState<number | ''>('')
  const [newTierDesc, setNewTierDesc] = useState('')

  // New add-on form state
  const [newAddOnLabel, setNewAddOnLabel] = useState('')
  const [newAddOnPrice, setNewAddOnPrice] = useState<number | ''>('')
  const [newAddOnDesc, setNewAddOnDesc] = useState('')

  // New refund tier form state
  const [newRefundDays, setNewRefundDays] = useState<number | ''>('')
  const [newRefundPct, setNewRefundPct] = useState<number | ''>('')

  // const addOnCategoryOptions = ADD_ON_CATEGORIES.map(c => ({ value: c.value, label: c.label }))

  const handleAddPricingTier = () => {
    const label = newTierLabel.trim()
    const price = typeof newTierPrice === 'number' ? newTierPrice : 0
    if (!label || price < 0) return
    addPricingTier(
      label,
      price,
      newTierDesc.trim() || undefined
    )
    setNewTierLabel('')
    setNewTierPrice('')
    setNewTierDesc('')
  }

  const handleAddAddOn = () => {
    const label = newAddOnLabel.trim()
    const price = typeof newAddOnPrice === 'number' ? newAddOnPrice : 0
    if (!label || price < 0) return
    addAddOn(
      label,
      price,
      undefined, // No default category
      newAddOnDesc.trim() || undefined
    )
    setNewAddOnLabel('')
    setNewAddOnPrice('')
    setNewAddOnDesc('')
  }

  const handleAddRefundTier = () => {
    const days = typeof newRefundDays === 'number' ? newRefundDays : -1
    const pct = typeof newRefundPct === 'number' ? newRefundPct : -1
    if (days < 0 || pct < 0 || pct > 100) return
    // prevent duplicate daysBeforeCancellation
    if (cancellationPolicy.some((t) => t.daysBeforeCancellation === days)) return
    addRefundTier(days, pct)
    setNewRefundDays('')
    setNewRefundPct('')
  }

  return (
    <div className="space-y-10">

      {/* ── Pricing Tiers ─────────────────────────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-neutral-900">Pricing Tiers</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Define one or more tiers (e.g. Double Sharing, Triple Sharing).
            </p>
          </div>
          <Badge variant="secondary">{pricings.length} tier{pricings.length !== 1 ? 's' : ''}</Badge>
        </div>

        {/* Existing tiers */}
        {pricings.length > 0 && (
          <div className="space-y-3">
            {pricings.map((tier, index) => (
              <div key={tier.id} className={`bg-white rounded-xl border p-4 space-y-3 ${index === 0 ? 'border-blue-300 ring-1 ring-blue-200' : 'border-neutral-200/60'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-medium">{tier.label || 'Pricing Tier'}</Label>
                    {index === 0 && (
                      <Badge variant="default" className="text-xs gap-1">
                        <Star className="w-3 h-3" /> Display Price
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {index !== 0 && (
                      <button
                        type="button"
                        onClick={() => setDisplayPricingTier(tier.id)}
                        className="text-xs text-blue-600 hover:text-blue-700 border border-blue-200 rounded-md px-2 py-1 transition-colors"
                      >
                        Set as Display Price
                      </button>
                    )}
                    <button type="button" onClick={() => removePricingTier(tier.id)} className="text-neutral-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-neutral-500">Label</Label>
                    <CustomInput type="text" placeholder="e.g., Double Sharing" value={tier.label}
                      onChange={(e) => updatePricingTier(tier.id, 'label', e.target.value)}
                      variant="input" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-neutral-500 flex items-center gap-1">
                      <IndianRupee className="w-3 h-3" /> Price per Person
                    </Label>
                    <CustomInput type="number" min="0" placeholder="8500" value={tier.pricePerPerson}
                      onChange={(e) => updatePricingTier(tier.id, 'pricePerPerson', e.target.value ? Number(e.target.value) : 0)}
                      variant="input" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-neutral-500">Description (optional)</Label>
                  <CustomInput type="text" placeholder="Short description" value={tier.description ?? ''}
                    onChange={(e) => updatePricingTier(tier.id, 'description', e.target.value || undefined)}
                    variant="input" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add new tier */}
        <div className="bg-neutral-50/50 rounded-2xl border border-neutral-200/50 p-4 space-y-4">
            <Label className="text-sm font-medium text-neutral-700">Add a Pricing Tier</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="newTierLabel" className="text-xs">Label <span className="text-red-500">*</span></Label>
                <CustomInput id="newTierLabel" type="text" placeholder="e.g., Double Sharing"
                  value={newTierLabel} onChange={(e) => setNewTierLabel(e.target.value)} variant="input" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="newTierPrice" className="text-xs flex items-center gap-1">
                  <IndianRupee className="w-3 h-3" /> Price/Person <span className="text-red-500">*</span>
                </Label>
                <CustomInput id="newTierPrice" type="number" min="0" placeholder="8500"
                  value={newTierPrice === '' ? '' : newTierPrice}
                  onChange={(e) => setNewTierPrice(e.target.value ? Number(e.target.value) : '')} variant="input" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="newTierDesc" className="text-xs">Description (optional)</Label>
              <CustomInput id="newTierDesc" type="text" placeholder="What does this tier include?"
                value={newTierDesc} onChange={(e) => setNewTierDesc(e.target.value)} variant="input" />
            </div>
            <button type="button" onClick={handleAddPricingTier}
              disabled={!newTierLabel.trim() || newTierPrice === '' || (newTierPrice as number) < 0}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <Plus className="w-4 h-4" />
              Add Pricing Tier
            </button>
          </div>
      </div>

      {/* ── Advance Booking ───────────────────────────────────────────────────── */}
      <div className="space-y-4 pt-6 border-t border-neutral-200">
        <h3 className="text-lg font-medium text-neutral-900">Advance Booking</h3>
        <p className="text-xs text-muted-foreground">
          Allow customers to book in advance with a deposit.
        </p>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 px-4 rounded-lg border border-neutral-200 bg-neutral-50">
            <div>
              <Label htmlFor="isAdvanceBookingAllowed" className="text-sm font-medium">
                Enable Advance Booking
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">
                Allow customers to pay a deposit to secure their spot
              </p>
            </div>
            <Toggle
              checked={isAdvanceBookingAllowed}
              onCheckedChange={(val) => updateField('isAdvanceBookingAllowed', val)}
              checkedLabel="Yes"
              uncheckedLabel="No"
            />
          </div>

          {isAdvanceBookingAllowed && (
            <>
              <div className="space-y-2">
                <Label htmlFor="advanceBookingPrice" className="text-sm">
                  Advance Booking Amount (% of total price) <span className="text-red-500">*</span>
                </Label>
                <CustomInput
                  id="advanceBookingPrice"
                  type="number"
                  min="1"
                  placeholder="e.g., 20%"
                  value={advanceBookingPrice || ''}
                  onChange={(e) => updateField('advanceBookingPrice', e.target.value ? Number(e.target.value) : 0)}
                  variant="input"
                />
                <p className="text-xs text-muted-foreground">
                  Advance booking amount will be % of the total trip cost.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="closeAdvanceBookingDays" className="text-sm">
                  Close Booking Deadline (days before trip)
                </Label>
                <CustomInput
                  id="closeAdvanceBookingDays"
                  type="number"
                  min="0"
                  placeholder="e.g., 7"
                  value={closeAdvanceBookingDays || ''}
                  onChange={(e) => updateField('closeAdvanceBookingDays', e.target.value ? Number(e.target.value) : 0)}
                  variant="input"
                />
                <p className="text-xs text-muted-foreground">
                  Advance bookings will close this many days before the trip starts.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Add-ons ───────────────────────────────────────────────────────────── */}
      <div className="space-y-4 pt-6 border-t border-neutral-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-neutral-900">Add-ons</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Optional extras travellers can purchase (e.g. room upgrades, activities).
            </p>
          </div>
          <Badge variant="secondary">{addOns.length} add-on{addOns.length !== 1 ? 's' : ''}</Badge>
        </div>

        {/* Existing add-ons */}
        {addOns.length > 0 && (
          <div className="space-y-3">
            {addOns.map((addon) => {
              // const catLabel = addon.category ? ADD_ON_CATEGORIES.find(c => c.value === addon.category)?.label ?? addon.category : 'No Category'
              return (
                <div key={addon.id} className="bg-white rounded-xl border border-neutral-200/60 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">{addon.label || 'Add-on'}</Label>
                    <button type="button" onClick={() => removeAddOn(addon.id)} className="text-neutral-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs text-neutral-500">Label</Label>
                      <CustomInput type="text" placeholder="e.g., Single Room Upgrade" value={addon.label}
                        onChange={(e) => updateAddOn(addon.id, 'label', e.target.value)}
                        variant="input" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-neutral-500 flex items-center gap-1">
                        <IndianRupee className="w-3 h-3" /> Price/Person
                      </Label>
                      <CustomInput type="number" min="0" placeholder="2000" value={addon.pricePerPerson}
                        onChange={(e) => updateAddOn(addon.id, 'pricePerPerson', e.target.value ? Number(e.target.value) : 0)}
                        variant="input" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-neutral-500">Description (optional)</Label>
                    <CustomInput type="text" placeholder="Short description" value={addon.description ?? ''}
                      onChange={(e) => updateAddOn(addon.id, 'description', e.target.value || undefined)}
                      variant="input" />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Add new add-on */}
        <div className="bg-neutral-50/50 rounded-2xl border border-neutral-200/50 p-4 space-y-4">
            <Label className="text-sm font-medium text-neutral-700">Add an Add-on</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="newAddOnLabel" className="text-xs">Label <span className="text-red-500">*</span></Label>
                <CustomInput id="newAddOnLabel" type="text" placeholder="e.g., Single Room Upgrade"
                  value={newAddOnLabel} onChange={(e) => setNewAddOnLabel(e.target.value)} variant="input" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="newAddOnPrice" className="text-xs flex items-center gap-1">
                  <IndianRupee className="w-3 h-3" /> Price/Person <span className="text-red-500">*</span>
                </Label>
                <CustomInput id="newAddOnPrice" type="number" min="0" placeholder="2000"
                  value={newAddOnPrice === '' ? '' : newAddOnPrice}
                  onChange={(e) => setNewAddOnPrice(e.target.value ? Number(e.target.value) : '')} variant="input" />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="newAddOnDesc" className="text-xs">Description (optional)</Label>
              <CustomInput id="newAddOnDesc" type="text" placeholder="What does this add-on include?"
                value={newAddOnDesc} onChange={(e) => setNewAddOnDesc(e.target.value)} variant="input" />
            </div>
            <button type="button" onClick={handleAddAddOn}
              disabled={!newAddOnLabel.trim() || newAddOnPrice === '' || (newAddOnPrice as number) < 0}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <Plus className="w-4 h-4" />
              Add Add-on
            </button>
          </div>
      </div>

      {/* ── Cancellation Policy ───────────────────────────────────────────────── */}
      <div className="space-y-4 pt-6 border-t border-neutral-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-neutral-900">Cancellation Policy</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Define refund tiers based on how far in advance a traveller cancels.
            </p>
          </div>
          <Badge variant="secondary">{cancellationPolicy.length} tier{cancellationPolicy.length !== 1 ? 's' : ''}</Badge>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <p className="text-xs text-amber-800">
            💡 Example: <strong>30 days before → 80% refund</strong>, <strong>15 days → 50%</strong>, <strong>7 days → 0%</strong>. Each tier must have a unique &quot;days before&quot; value.
          </p>
        </div>

        {/* Existing tiers */}
        {cancellationPolicy.length > 0 && (
          <div className="space-y-2">
            {[...cancellationPolicy]
              .sort((a, b) => b.daysBeforeCancellation - a.daysBeforeCancellation)
              .map((tier) => (
                <div key={tier.id} className="bg-white rounded-xl border border-neutral-200/60 p-4">
                  <div className="flex items-center justify-between">
                    <div className="grid grid-cols-2 gap-6 flex-1">
                      <div className="space-y-1">
                        <Label className="text-xs text-neutral-500">Days Before Cancellation</Label>
                        <CustomInput
                          type="number" min="0" placeholder="30"
                          value={tier.daysBeforeCancellation}
                          onChange={(e) => updateRefundTier(tier.id, 'daysBeforeCancellation', e.target.value ? Number(e.target.value) : 0)}
                          variant="input"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs text-neutral-500">Refund % (0–100)</Label>
                        <CustomInput
                          type="number" min="0" max="100" placeholder="80"
                          value={tier.refundPercentage}
                          onChange={(e) => updateRefundTier(tier.id, 'refundPercentage', e.target.value ? Math.min(100, Number(e.target.value)) : 0)}
                          variant="input"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRefundTier(tier.id)}
                      className="ml-4 text-neutral-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Add new refund tier */}
        <div className="bg-neutral-50/50 rounded-2xl border border-neutral-200/50 p-4 space-y-4">
          <Label className="text-sm font-medium text-neutral-700">Add a Refund Tier</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="newRefundDays" className="text-xs">Days Before <span className="text-red-500">*</span></Label>
              <CustomInput
                id="newRefundDays" type="number" min="0" placeholder="e.g., 30"
                value={newRefundDays === '' ? '' : newRefundDays}
                onChange={(e) => setNewRefundDays(e.target.value ? Number(e.target.value) : '')}
                variant="input"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="newRefundPct" className="text-xs">Refund % <span className="text-red-500">*</span></Label>
              <CustomInput
                id="newRefundPct" type="number" min="0" max="100" placeholder="e.g., 80"
                value={newRefundPct === '' ? '' : newRefundPct}
                onChange={(e) => setNewRefundPct(e.target.value ? Math.min(100, Number(e.target.value)) : '')}
                variant="input"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleAddRefundTier}
            disabled={newRefundDays === '' || newRefundPct === '' || (newRefundPct as number) < 0 || (newRefundPct as number) > 100}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add Refund Tier
          </button>
        </div>
      </div>

    </div>
  )
}

export default PricingStep
