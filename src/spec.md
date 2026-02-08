# Specification

## Summary
**Goal:** Remove the localized price from the Landing page, show it instead on the Input & Payment screen before generation, and replace the Landing price area with a new static image.

**Planned changes:**
- Remove the price/currency UI from the Landing screen and stop relying on the regional pricing hook there.
- Display the localized price on the Input & Payment flow before caricature generation using the existing regional pricing logic and formatting.
- Add a new static, caricature-themed image asset on the Landing screen where the price section used to be, keeping the layout responsive.

**User-visible outcome:** The Landing page no longer shows any price; users see a new image there instead, and the localized price appears on the Input & Payment screen before generation starts.
