---
date: "2026-10-15"
title: "Task page boxes consistency"
tags: ["Tasks","Appearance"]
summary: "Task page boxes now share one consistent 1px outline and corner radius (5px for Porcelain/Graphite/AMOLED, 10px for Dia)."
---

The task detail view now displays one consistent outline and corner style for all content panels. This change unifies the visual language on the task page across all four light and dark themes.

### What changed

Every content box on a task page now uses the same border behavior:

| Theme           | Border thickness | Corner radius |
|-----------------|------------------|---------------|
| Porcelain       | 1px hairline     | 5px           |
| Graphite        | 1px hairline     | 5px           |
| AMOLED          | 1px hairline     | 5px           |
| Dia             | 1px hairline     | 10px          |

Affected boxes:

- Task description
- Posted comments
- Comment input
- Details panel

There are no half states. The outline is either fully applied to all four sides of a box or not applied at all. No user controls or toggles affect this behavior -- it is applied automatically.

### How it works

The styling change is a product-level update to component rendering on the task detail path. The single outline thickness and uniform corner radii are enforced by the updated component definitions across the product.

### Affected tickets

- [HTPR-7194](https://app.hypertask.ai/detail/project-15/7194)

## Related tickets

- [https://app.hypertask.ai/detail/project-15/7194](https://app.hypertask.ai/detail/project-15/7194)
