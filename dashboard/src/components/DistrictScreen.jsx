import { useMemo, useState } from 'react'
import Chart from './Chart'
import KpiCard from './KpiCard'
import {
  AGE_DISTRIBUTION,
  COMMUNITY_METRICS,
  DISTRICT_SUMMARY,
  GENDER_DISTRIBUTION,
  MONTHLY_TREND,
  TAG_BREAKDOWN,
} from '../data/mockData'

const axisStyle = {
  axisLine: { lineStyle: { color: 'rgba(138,216,255,0.25)' } },
  axisLabel: { color: '#8eb0d0', fontSize: 11 },
  splitLine: { lineStyle: { color: 'rgba(138,216,255,0.08)' } },
}

export default function DistrictScreen({ onEnterCommunity, filters }) {
  const [compareMetric, setCompareMetric] = useState('followRate')
  const [demoTab, setDemoTab] = useState('age')

  const ranked = useMemo(
    () => [...COMMUNITY_METRICS].sort((a, b) => b.score - a.score),
    []
  )

  const compareOption = useMemo(() => {
    const metricMap = {
      followRate: { key: 'followRate', name: '随访管理率', unit: '%' },
      smokeSurveyRate: { key: 'smokeSurveyRate', name: '戒烟调查完成率', unit: '%' },
      dietPushRate: { key: 'dietPushRate', name: '建议书推送覆盖率', unit: '%' },
      taggedRatio: { key: 'taggedRatio', name: '标签人数占签约比', unit: '%' },
    }
    const m = metricMap[compareMetric]
    const data = [...COMMUNITY_METRICS].sort((a, b) => b[m.key] - a[m.key])
    return {
      grid: { top: 28, right: 24, bottom: 36, left: 72 },
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(8,24,36,0.92)',
        borderColor: 'rgba(63,208,212,0.35)',
        textStyle: { color: '#e8f4f6', fontSize: 12 },
      },
      xAxis: {
        type: 'category',
        data: data.map((d) => d.short),
        ...axisStyle,
        axisLabel: { ...axisStyle.axisLabel, interval: 0, rotate: 30 },
      },
      yAxis: {
        type: 'value',
        name: m.unit,
        nameTextStyle: { color: '#5f7d86', fontSize: 11 },
        min: Math.max(0, Math.floor(Math.min(...data.map((d) => d[m.key])) - 8)),
        ...axisStyle,
      },
      series: [
        {
          type: 'bar',
          data: data.map((d) => d[m.key]),
          barWidth: 18,
          itemStyle: {
            borderRadius: [3, 3, 0, 0],
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#8ad8ff' },
                { offset: 1, color: '#2f7dff' },
              ],
            },
          },
        },
      ],
    }
  }, [compareMetric])

  const trendOption = useMemo(() => ({
    grid: { top: 36, right: 18, bottom: 28, left: 42 },
    legend: {
      top: 0,
      right: 0,
      textStyle: { color: '#8eacb4', fontSize: 11 },
      itemWidth: 12,
      itemHeight: 8,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(8,24,36,0.92)',
      borderColor: 'rgba(63,208,212,0.35)',
      textStyle: { color: '#e8f4f6', fontSize: 12 },
    },
    xAxis: {
      type: 'category',
      data: MONTHLY_TREND.map((d) => d.month),
      ...axisStyle,
    },
    yAxis: [
      {
        type: 'value',
        name: '人',
        nameTextStyle: { color: '#5f7d86', fontSize: 11 },
        ...axisStyle,
      },
      {
        type: 'value',
        name: '%',
        min: 60,
        max: 100,
        nameTextStyle: { color: '#5f7d86', fontSize: 11 },
        ...axisStyle,
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: '标签人数',
        type: 'bar',
        data: MONTHLY_TREND.map((d) => d.tagged),
        barWidth: 16,
        itemStyle: { color: 'rgba(63,208,212,0.35)', borderRadius: [2, 2, 0, 0] },
      },
      {
        name: '戒烟完成率',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: MONTHLY_TREND.map((d) => d.smoke),
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 2, color: '#3fd0d4' },
        itemStyle: { color: '#3fd0d4' },
      },
      {
        name: '推送覆盖率',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: MONTHLY_TREND.map((d) => d.diet),
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 2, color: '#2bb673' },
        itemStyle: { color: '#2bb673' },
      },
      {
        name: '随访管理率',
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        data: MONTHLY_TREND.map((d) => d.follow),
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: { width: 2, color: '#e8b84a' },
        itemStyle: { color: '#e8b84a' },
      },
    ],
  }), [])

  const demoOption = useMemo(() => {
    if (demoTab === 'gender') {
      return {
        tooltip: { trigger: 'item', backgroundColor: 'rgba(8,24,36,0.92)', borderColor: 'rgba(63,208,212,0.35)', textStyle: { color: '#e8f4f6' } },
        series: [{
          type: 'pie',
          radius: ['48%', '70%'],
          center: ['50%', '52%'],
          label: { color: '#cfe7ea', formatter: '{b}\n{c}%' },
          data: GENDER_DISTRIBUTION.map((d, i) => ({
            ...d,
            itemStyle: { color: i === 0 ? '#3fd0d4' : '#2bb673' },
          })),
        }],
      }
    }
    if (demoTab === 'tag') {
      return {
        grid: { top: 16, right: 16, bottom: 28, left: 72 },
        xAxis: { type: 'value', ...axisStyle },
        yAxis: { type: 'category', data: TAG_BREAKDOWN.map((d) => d.name).reverse(), ...axisStyle },
        series: [{
          type: 'bar',
          data: TAG_BREAKDOWN.map((d) => d.value).reverse(),
          barWidth: 14,
          itemStyle: {
            borderRadius: [0, 3, 3, 0],
            color: {
              type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
              colorStops: [
                { offset: 0, color: '#1a6b6e' },
                { offset: 1, color: '#7ee7ea' },
              ],
            },
          },
          label: { show: true, position: 'right', color: '#8eacb4', formatter: '{c}%' },
        }],
      }
    }
    return {
      tooltip: { trigger: 'item', backgroundColor: 'rgba(8,24,36,0.92)', borderColor: 'rgba(63,208,212,0.35)', textStyle: { color: '#e8f4f6' } },
      series: [{
        type: 'pie',
        radius: ['0%', '68%'],
        center: ['50%', '52%'],
        roseType: 'radius',
        label: { color: '#cfe7ea', formatter: '{b}\n{c}%', fontSize: 11 },
        data: AGE_DISTRIBUTION.map((d, i) => ({
          ...d,
          itemStyle: {
            color: ['#1f8a8e', '#2bb673', '#3fd0d4', '#e8b84a', '#6aa8b0'][i],
          },
        })),
      }],
    }
  }, [demoTab])

  const s = DISTRICT_SUMMARY

  return (
    <div className="screen">
      <div className="kpi-row">
        <KpiCard
          label="签约总人数"
          value={s.signed.toLocaleString()}
          unit="人"
          sub="家庭医生签约居民合计"
        />
        <KpiCard
          label="重点服务对象标签人数"
          value={s.tagged.toLocaleString()}
          unit="人"
          sub="三高一重重点服务对象"
        />
        <KpiCard
          label="标签人数占签约居民比例"
          value={s.taggedRatio}
          unit="%"
          rate={s.taggedRatio}
          sub="按机构 / 年龄 / 性别可下钻"
        />
        <KpiCard
          label="戒烟调查完成率"
          value={s.smokeSurveyRate}
          unit="%"
          rate={s.smokeSurveyRate}
          sub={`已完成 <strong>${s.smokeSurveyDone.toLocaleString()}</strong> 人`}
        />
        <KpiCard
          label="膳食运动建议书主动推送覆盖率"
          value={s.dietPushRate}
          unit="%"
          rate={s.dietPushRate}
          sub={`已推送 <strong>${s.dietPush.toLocaleString()}</strong> 人`}
        />
        <KpiCard
          label="随访管理率（高/糖每季度1次）"
          value={s.followRate}
          unit="%"
          rate={s.followRate}
          sub={`已随访 <strong>${s.followDone.toLocaleString()}</strong> · 未完成 <strong>${s.followPending.toLocaleString()}</strong>`}
        />
      </div>

      <div className="main-grid">
        <div className="col col-left">
          <div className="panel">
            <div className="panel-title">
              <span>机构综合绩效排名</span>
              <span className="hint">点击下钻至社区级</span>
            </div>
            <div className="panel-body">
              <div className="rank-list">
                {ranked.map((item, idx) => (
                  <div
                    key={item.id}
                    className="rank-item"
                    onClick={() => onEnterCommunity(item.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === 'Enter' && onEnterCommunity(item.id)}
                  >
                    <div className="rank-no">{idx + 1}</div>
                    <div>
                      <div className="rank-name">{item.name}</div>
                      <div className="rank-meta">
                        标签 {item.tagged} · 随访率 {item.followRate}%
                      </div>
                    </div>
                    <div className="rank-score">
                      <div className="num">{item.score}</div>
                      <div className="label">综合分</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-title">
              <span>重点对象标签构成</span>
            </div>
            <div className="panel-body">
              <div className="tag-chips">
                {TAG_BREAKDOWN.map((t) => (
                  <span key={t.name} className="tag-chip">
                    {t.name}
                    <strong>{t.value}%</strong>
                  </span>
                ))}
              </div>
              <Chart
                option={{
                  grid: { top: 8, right: 8, bottom: 8, left: 8 },
                  series: [{
                    type: 'pie',
                    radius: ['42%', '68%'],
                    center: ['50%', '55%'],
                    label: { show: false },
                    data: TAG_BREAKDOWN.map((d, i) => ({
                      name: d.name,
                      value: d.value,
                      itemStyle: {
                        color: ['#e8735a', '#e8b84a', '#3fd0d4', '#2bb673'][i],
                      },
                    })),
                  }],
                }}
              />
            </div>
          </div>
        </div>

        <div className="col col-center">
          <div className="panel" style={{ minHeight: 280 }}>
            <div className="panel-title">
              <span>各社区卫生服务中心横向对比</span>
              <div className="compare-tabs">
                {[
                  { id: 'followRate', label: '随访率' },
                  { id: 'smokeSurveyRate', label: '戒烟调查' },
                  { id: 'dietPushRate', label: '建议书推送' },
                  { id: 'taggedRatio', label: '标签占比' },
                ].map((t) => (
                  <button
                    key={t.id}
                    className={compareMetric === t.id ? 'active' : ''}
                    onClick={() => setCompareMetric(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="panel-body">
              <Chart option={compareOption} />
            </div>
          </div>

          <div className="panel">
            <div className="panel-title">
              <span>核心指标趋势分析</span>
              <span className="hint">时间维度 · {filters.periodLabel}</span>
            </div>
            <div className="panel-body">
              <Chart option={trendOption} />
            </div>
          </div>
        </div>

        <div className="col col-right">
          <div className="panel">
            <div className="panel-title">
              <span>随访结果监测</span>
              <span className="hint">高血压 / 糖尿病</span>
            </div>
            <div className="panel-body">
              <div className="follow-stats">
                <div className="follow-card done">
                  <div className="label">已随访完成数</div>
                  <div className="num">{s.followDone.toLocaleString()}</div>
                  <div className="sub">应访 {s.followTarget.toLocaleString()} 人</div>
                </div>
                <div className="follow-card pending">
                  <div className="label">未完成随访数</div>
                  <div className="num">{s.followPending.toLocaleString()}</div>
                  <div className="sub">需催办跟进</div>
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-title">
              <span>服务对象画像下钻</span>
              <div className="compare-tabs">
                {[
                  { id: 'age', label: '年龄' },
                  { id: 'gender', label: '性别' },
                  { id: 'tag', label: '标签' },
                ].map((t) => (
                  <button
                    key={t.id}
                    className={demoTab === t.id ? 'active' : ''}
                    onClick={() => setDemoTab(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="panel-body">
              <Chart option={demoOption} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
