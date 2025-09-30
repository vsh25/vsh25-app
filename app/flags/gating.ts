// app/flags/gating.ts
export type ResourceId = 'bio' | 'pill' | 'kb';

type GateMode = 'free' | 'pay';

// По умолчанию всё free. Когда решите — меняем тут.
export const gating: Record<ResourceId, GateMode> = {
  bio: 'free',   // пример: поменяете на 'pay'
  pill: 'free',
  kb:  'free',
};

export const isPaywalled = (id: ResourceId) => gating[id] === 'pay';

