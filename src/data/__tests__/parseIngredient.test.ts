import { describe, expect, it } from 'vitest';

import { parseIngredient } from '../recipeLoader';

describe('parseIngredient', () => {
  it('marks "naar smaak 150g" as scalable with a numeric amount', () => {
    expect(parseIngredient('naar smaak 150g')).toMatchObject({
      amount: '150g',
      scalable: true,
    });
  });
});
