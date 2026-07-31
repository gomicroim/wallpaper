/** 杨浦区「三高一重」社区运动干预 — 演示数据 */

export const COMMUNITIES = [
  { id: 'yp01', name: '延吉社区卫生服务中心', short: '延吉' },
  { id: 'yp02', name: '控江社区卫生服务中心', short: '控江' },
  { id: 'yp03', name: '四平社区卫生服务中心', short: '四平' },
  { id: 'yp04', name: '长白社区卫生服务中心', short: '长白' },
  { id: 'yp05', name: '江浦社区卫生服务中心', short: '江浦' },
  { id: 'yp06', name: '五角场社区卫生服务中心', short: '五角场' },
  { id: 'yp07', name: '殷行社区卫生服务中心', short: '殷行' },
  { id: 'yp08', name: '大桥社区卫生服务中心', short: '大桥' },
  { id: 'yp09', name: '平凉社区卫生服务中心', short: '平凉' },
  { id: 'yp10', name: '定海社区卫生服务中心', short: '定海' },
  { id: 'yp11', name: '长海社区卫生服务中心', short: '长海' },
  { id: 'yp12', name: '新江湾城社区卫生服务中心', short: '新江湾' },
]

const seeded = (seed) => {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function buildCommunityMetrics(id, index) {
  const rnd = seeded(1000 + index * 97)
  const signed = Math.floor(8200 + rnd() * 6800)
  const tagged = Math.floor(signed * (0.18 + rnd() * 0.12))
  const smokeSurveyDone = Math.floor(tagged * (0.72 + rnd() * 0.24))
  const dietPush = Math.floor(tagged * (0.68 + rnd() * 0.28))
  const followTarget = Math.floor(tagged * (0.55 + rnd() * 0.2))
  const followDone = Math.floor(followTarget * (0.78 + rnd() * 0.2))
  const followPending = followTarget - followDone
  return {
    id,
    signed,
    tagged,
    taggedRatio: +(tagged / signed * 100).toFixed(1),
    smokeSurveyDone,
    smokeSurveyRate: +(smokeSurveyDone / tagged * 100).toFixed(1),
    dietPush,
    dietPushRate: +(dietPush / tagged * 100).toFixed(1),
    followTarget,
    followDone,
    followPending,
    followRate: +(followDone / followTarget * 100).toFixed(1),
    score: +(
      (smokeSurveyDone / tagged) * 30 +
      (dietPush / tagged) * 30 +
      (followDone / followTarget) * 40
    ).toFixed(1),
  }
}

export const COMMUNITY_METRICS = COMMUNITIES.map((c, i) => ({
  ...c,
  ...buildCommunityMetrics(c.id, i),
}))

export const DISTRICT_SUMMARY = COMMUNITY_METRICS.reduce(
  (acc, m) => {
    acc.signed += m.signed
    acc.tagged += m.tagged
    acc.smokeSurveyDone += m.smokeSurveyDone
    acc.dietPush += m.dietPush
    acc.followTarget += m.followTarget
    acc.followDone += m.followDone
    acc.followPending += m.followPending
    return acc
  },
  {
    signed: 0,
    tagged: 0,
    smokeSurveyDone: 0,
    dietPush: 0,
    followTarget: 0,
    followDone: 0,
    followPending: 0,
  }
)

DISTRICT_SUMMARY.taggedRatio = +(DISTRICT_SUMMARY.tagged / DISTRICT_SUMMARY.signed * 100).toFixed(1)
DISTRICT_SUMMARY.smokeSurveyRate = +(DISTRICT_SUMMARY.smokeSurveyDone / DISTRICT_SUMMARY.tagged * 100).toFixed(1)
DISTRICT_SUMMARY.dietPushRate = +(DISTRICT_SUMMARY.dietPush / DISTRICT_SUMMARY.tagged * 100).toFixed(1)
DISTRICT_SUMMARY.followRate = +(DISTRICT_SUMMARY.followDone / DISTRICT_SUMMARY.followTarget * 100).toFixed(1)

export const MONTHLY_TREND = [
  { month: '1月', tagged: 11820, smoke: 72.1, diet: 68.4, follow: 79.2 },
  { month: '2月', tagged: 12140, smoke: 74.3, diet: 70.1, follow: 80.5 },
  { month: '3月', tagged: 12680, smoke: 76.8, diet: 72.6, follow: 82.1 },
  { month: '4月', tagged: 13020, smoke: 78.2, diet: 74.8, follow: 83.4 },
  { month: '5月', tagged: 13390, smoke: 80.1, diet: 76.2, follow: 84.7 },
  { month: '6月', tagged: 13750, smoke: 81.6, diet: 78.5, follow: 86.2 },
  { month: '7月', tagged: DISTRICT_SUMMARY.tagged, smoke: DISTRICT_SUMMARY.smokeSurveyRate, diet: DISTRICT_SUMMARY.dietPushRate, follow: DISTRICT_SUMMARY.followRate },
]

export const AGE_DISTRIBUTION = [
  { name: '35-44岁', value: 12 },
  { name: '45-54岁', value: 21 },
  { name: '55-64岁', value: 34 },
  { name: '65-74岁', value: 23 },
  { name: '75岁及以上', value: 10 },
]

export const GENDER_DISTRIBUTION = [
  { name: '男', value: 47.6 },
  { name: '女', value: 52.4 },
]

export const TAG_BREAKDOWN = [
  { name: '高血压', value: 42 },
  { name: '糖尿病', value: 28 },
  { name: '高血脂', value: 18 },
  { name: '超重肥胖', value: 12 },
]

function buildDoctors(communityId, index) {
  const rnd = seeded(5000 + index * 131)
  const names = ['王建国', '李敏', '张晓华', '陈丽', '刘强', '赵静', '周伟', '吴芳', '郑磊', '孙婷', '马超', '黄燕']
  const count = 6 + Math.floor(rnd() * 4)
  return Array.from({ length: count }, (_, i) => {
    const assigned = Math.floor(80 + rnd() * 160)
    const smokeDone = Math.floor(assigned * (0.7 + rnd() * 0.28))
    const dietDone = Math.floor(assigned * (0.65 + rnd() * 0.3))
    const followDone = Math.floor(assigned * (0.75 + rnd() * 0.22))
    const followPending = Math.max(0, Math.floor(assigned * 0.35) - Math.floor(followDone * 0.4))
    return {
      id: `${communityId}-d${i + 1}`,
      name: names[(index + i) % names.length],
      team: `${(i % 4) + 1}号家庭医生团队`,
      assigned,
      smokeDone,
      smokeRate: +(smokeDone / assigned * 100).toFixed(1),
      dietDone,
      dietRate: +(dietDone / assigned * 100).toFixed(1),
      followDone,
      followPending,
      followRate: +((followDone / (followDone + followPending)) * 100).toFixed(1),
    }
  }).sort((a, b) => b.followRate - a.followRate)
}

export const DOCTORS_BY_COMMUNITY = Object.fromEntries(
  COMMUNITIES.map((c, i) => [c.id, buildDoctors(c.id, i)])
)

export const COMMUNITY_TREND = Object.fromEntries(
  COMMUNITIES.map((c, i) => {
    const base = COMMUNITY_METRICS[i]
    return [
      c.id,
      MONTHLY_TREND.map((m, mi) => ({
        month: m.month,
        tagged: Math.floor(base.tagged * (0.82 + mi * 0.03)),
        smoke: +(base.smokeSurveyRate - 8 + mi * 1.2).toFixed(1),
        diet: +(base.dietPushRate - 9 + mi * 1.3).toFixed(1),
        follow: +(base.followRate - 7 + mi * 1.1).toFixed(1),
      })),
    ]
  })
)

export const FILTER_OPTIONS = {
  periods: [
    { id: 'q2', label: '2026年第二季度' },
    { id: 'q1', label: '2026年第一季度' },
    { id: 'y2026', label: '2026年累计' },
    { id: 'y2025', label: '2025年全年' },
  ],
  ages: [
    { id: 'all', label: '全部年龄' },
    { id: '35-54', label: '35-54岁' },
    { id: '55-64', label: '55-64岁' },
    { id: '65+', label: '65岁及以上' },
  ],
  genders: [
    { id: 'all', label: '全部性别' },
    { id: 'male', label: '男性' },
    { id: 'female', label: '女性' },
  ],
}
