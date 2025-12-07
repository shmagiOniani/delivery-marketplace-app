import type { ItemSize } from '@/types';

const BASE_PRICE = 15;
const PRICE_PER_KM = 2;
const PRICE_PER_FLOOR = 3;
const NO_ELEVATOR_MULTIPLIER = 1.5;

const SIZE_MULTIPLIERS: Record<ItemSize, number> = {
  small: 1,
  medium: 1.5,
  large: 2,
  xlarge: 3,
};

const PLATFORM_FEE_PERCENTAGE = 0.15;

export interface PriceCalculationParams {
  distanceKm: number;
  floor?: number;
  hasElevator?: boolean;
  itemSize: ItemSize;
}

export interface PriceCalculationResult {
  basePrice: number;
  distancePrice: number;
  floorPrice: number;
  sizeMultiplier: number;
  elevatorMultiplier: number;
  subtotal: number;
  platformFee: number;
  total: number;
  driverPayout: number;
}

export const calculatePrice = (
  params: PriceCalculationParams
): PriceCalculationResult => {
  const { distanceKm, floor = 0, hasElevator = true, itemSize } = params;

  const basePrice = BASE_PRICE;
  const distancePrice = distanceKm * PRICE_PER_KM;
  const floorPrice = floor > 0 ? floor * PRICE_PER_FLOOR : 0;
  const sizeMultiplier = SIZE_MULTIPLIERS[itemSize] || 1;
  const elevatorMultiplier = hasElevator ? 1 : NO_ELEVATOR_MULTIPLIER;

  const subtotal =
    (basePrice + distancePrice + floorPrice) *
    sizeMultiplier *
    elevatorMultiplier;

  const platformFee = subtotal * PLATFORM_FEE_PERCENTAGE;
  const total = subtotal + platformFee;
  const driverPayout = subtotal - platformFee;

  return {
    basePrice,
    distancePrice,
    floorPrice,
    sizeMultiplier,
    elevatorMultiplier,
    subtotal: Math.round(subtotal * 100) / 100,
    platformFee: Math.round(platformFee * 100) / 100,
    total: Math.round(total * 100) / 100,
    driverPayout: Math.round(driverPayout * 100) / 100,
  };
};

