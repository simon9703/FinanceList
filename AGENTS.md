# FinanceList Agent Notes

- UI font weight must not exceed 700. Do not use Tailwind 900-weight utilities or CSS weights above 700; use `font-bold` at most.
- Prefer project shadcn-style components from `components/ui/*` for common controls: `Button`, `Badge`, `Input`, and `Slider`.
- Tabs, tags, input fields, and sliders should be interactive when presented as controls; avoid static mock controls unless explicitly decorative.
- Keep imports direct and simple; never wrap imports in try/catch.
