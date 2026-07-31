import { useMemo, useState } from 'react'
import Chart from './Chart'
import KpiCard from './KpiCard'
import {
  AGE_DISTRIBUTION,
  COMMUNITY_METRICS,
  COMMUNITY_TREND,
  DOCTORS_BY_COMMUNITY,
  GENDER_DISTRIBUTION,
  TAG_BREAKDOWN,
} from '../data/mockData'

const axisStyle = {
  axisLine: { lineStyle: { color: 'rgba(126,231,234,0.25)' } },
  axisLabel: { color: '#8eacb4', fontSize: 11 },
  splitLine: { lineStyle: { color: 'rgba(126,231,234,0.08)' } },
}

function rateClass(rate) {
  if (rate >= 90) return 'good'
  if (rate >= 80) return 'mid'
  return 'low'
}

export default function CommunityScreen({ communityId, onBack, filters, locked }) {
  const [composeTab, setComposeTab] = useState('tag')
  const community = COMMUNITY_METRICS.find((c) => c.id === communityId) || COMMUNITY_METRICS[0]
  const doctors = DOCTORS_BY_COMMUNITY[community.id] || []
  const trend = COMMUNITY_TREND[community.id] || []

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
      data: trend.map((d) => d.month),
      ...axisStyle,
    },
    yAxis: {
      type: 'value',
      min: 60,
      max: 100,
      name: '%',
      nameTextStyle: { color: '#5f7d86', fontSize: 11 },
      ...axisStyle,
    },
    series: [
      {
        name: '戒烟完成率',
        type: 'line',
        smooth: true,
        data: trend.map((d) => d.smoke),
        areaStyle: { color: 'rgba(63,208,212,0.08)' },
        lineStyle: { width: 2, color: '#3fd0d4' },
        itemStyle: { color: '#3fd0d4' },
      },
      {
        name: '推送覆盖率',
        type: 'line',
        smooth: true,
        data: trend.map((d) => d.diet),
        lineStyle: { width: 2, color: '#2bb673' },
        itemStyle: { color: '#2bb673' },
      },
      {
        name: '随访管理率',
        type: 'line',
        smooth: true,
        data: trend.map((d) => d.follow),
        lineStyle: { width: 2, color: '#e8b84a' },
        itemStyle: { color: '#e8b84a' },
      },
    ],
  }), [trend])

  const ageOption = useMemo(() => ({
    tooltip: { trigger: 'item', backgroundColor: 'rgba(8,24,36,0.92)', borderColor: 'rgba(63,208,212,0.35)', textStyle: { color: '#e8f4f6' } },
    legend: { bottom: 0, textStyle: { color: '#8eacb4', fontSize: 11 } },
    series: [{
      type: 'pie',
      radius: ['40%', '62%'],
      center: ['50%', '44%'],
      label: { color: '#cfe7ea', formatter: '{b}\n{d}%', fontSize: 11 },
      data: AGE_DISTRIBUTION.map((d, i) => ({
        ...d,
        itemStyle: { color: ['#1f8a8e', '#2bb673', '#3fd0d4', '#e8b84a', '#6aa8b0'][i] },
      })),
    }],
  }), [])

  const genderOption = useMemo(() => ({
    grid: { top: 20, right: 20, bottom: 30, left: 40 },
    xAxis: { type: 'category', data: GENDER_DISTRIBUTION.map((d) => d.name), ...axisStyle },
    yAxis: { type: 'value', max: 100, ...axisStyle },
    series: [{
      type: 'bar',
      data: GENDER_DISTRIBUTION.map((d) => d.value),
      barWidth: 36,
      itemStyle: {
        borderRadius: [4, 4, 0, 0],
        color: (params) => (params.dataIndex === 0 ? '#3fd0d4' : '#2bb673'),
      },
      label: { show: true, position: 'top', color: '#cfe7ea', formatter: '{c}%' },
    }],
  }), [])

  return (
    <div className="screen">
      <div className="kpi-row">
        <KpiCard
          label="本机构重点服务对象标签人数"
          value={community.tagged.toLocaleString()}
          unit="人"
          sub={`签约居民 <strong>${community.signed.toLocaleString()}</strong> 人`}
        />
        <KpiCard
          label="标签人数占签约居民比例"
          value={community.taggedRatio}
          unit="%"
          rate={community.taggedRatio}
          sub={`区平均 ${filters.districtTaggedRatio}%`}
        />
        <KpiCard
          label="戒烟调查完成率"
          value={community.smokeSurveyRate}
          unit="%"
          rate={community.smokeSurveyRate}
          sub={`已完成 <strong>${community.smokeSurveyDone.toLocaleString()}</strong> 人`}
        />
        <KpiCard
          label="膳食运动建议书主动推送覆盖率"
          value={community.dietPushRate}
          unit="%"
          rate={community.dietPushRate}
          sub={`已推送 <strong>${community.dietPush.toLocaleString()}</strong> 人`}
        />
        <KpiCard
          label="随访管理率（高/糖每季度1次）"
          value={community.followRate}
          unit="%"
          rate={community.followRate}
          sub={`已完成 <strong>${community.followDone}</strong> · 未完成 <strong>${community.followPending}</strong>`}
        />
      </div>

      <div className="community-grid">
        <div className="community-left">
          <div className="panel" style={{ minHeight: 120 }}>
            <div className="panel-title">
              <span>本机构随访结果</span>
              <span className="hint">{filters.periodLabel}</span>
            </div>
            <div className="panel-body">
              <div className="follow-stats">
                <div className="follow-card done">
                  <div className="label">已随访完成数</div>
                  <div className="num">{community.followDone.toLocaleString()}</div>
                  <div className="sub">应访对象 {community.followTarget} 人</div>
                </div>
                <div className="follow-card pending">
                  <div className="label">未完成随访数</div>
                  <div className="num">{community.followPending.toLocaleString()}</div>
                  <div className="sub">请督促责任医生完成</div>
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-title">
              <span>本机构核心指标趋势</span>
            </div>
            <div className="panel-body">
              <Chart option={trendOption} />
            </div>
          </div>

          <div className="panel">
            <div className="panel-title">
              <span>本机构服务对象构成</span>
              <div className="compare-tabs">
                <button className={composeTab === 'age' ? 'active' : ''} onClick={() => setComposeTab('age')}>年龄</button>
                <button className={composeTab === 'gender' ? 'active' : ''} onClick={() => setComposeTab('gender')}>性别</button>
                <button className={composeTab === 'tag' ? 'active' : ''} onClick={() => setComposeTab('tag')}>标签</button>
              </div>
            </div>
            <div className="panel-body">
              {composeTab === 'age' && <Chart option={ageOption} />}
              {composeTab === 'gender' && <Chart option={genderOption} />}
              {composeTab === 'tag' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, paddingTop: 8 }}>
                  {TAG_BREAKDOWN.map((t, i) => (
                    <div key={t.name} className="follow-card" style={{ minHeight: 72 }}>
                      <div className="label">{t.name}</div>
                      <div className="num" style={{ color: ['#e8735a', '#e8b84a', '#3fd0d4', '#2bb673'][i], fontSize: 26 }}>
                        {Math.round(community.tagged * t.value / 100)}
                      </div>
                      <div className="sub">占比 {t.value}%</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="community-right">
          <div className="panel">
            <div className="panel-title">
              <span>家庭医生执行明细</span>
              <span className="hint">
                {locked ? '仅本机构可见 · 数据分级管控' : '社区级权限视图'}
              </span>
            </div>
            <div className="panel-body">
              <div className="doctor-table-wrap">
                <table className="doctor-table">
                  <thead>
                    <tr>
                      <th>责任医生</th>
                      <th>团队</th>
                      <th>分管标签对象</th>
                      <th>戒烟调查</th>
                      <th>建议书推送</th>
                      <th>已随访</th>
                      <th>未随访</th>
                      <th>随访完成率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((d) => (
                      <tr key={d.id}>
                        <td>{d.name}</td>
                        <td style={{ color: '#8eacb4' }}>{d.team}</td>
                        <td className="num">{d.assigned}</td>
                        <td>
                          <span className={`rate-pill ${rateClass(d.smokeRate)}`}>{d.smokeRate}%</span>
                        </td>
                        <td>
                          <span className={`rate-pill ${rateClass(d.dietRate)}`}>{d.dietRate}%</span>
                        </td>
                        <td className="num" style={{ color: '#6ee7a8' }}>{d.followDone}</td>
                        <td className="num" style={{ color: '#f0a090' }}>{d.followPending}</td>
                        <td>
                          <span className={`rate-pill ${rateClass(d.followRate)}`}>{d.followRate}%</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-title">
              <span>医生随访完成率对比</span>
            </div>
            <div className="panel-body">
              <Chart
                option={{
                  grid: { top: 16, right: 24, bottom: 40, left: 48 },
                  tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(8,24,36,0.92)',
                    borderColor: 'rgba(63,208,212,0.35)',
                    textStyle: { color: '#e8f4f6', fontSize: 12 },
                  },
                  xAxis: {
                    type: 'category',
                    data: doctors.map((d) => d.name),
                    ...axisStyle,
                    axisLabel: { ...axisStyle.axisLabel, interval: 0, rotate: 25 },
                  },
                  yAxis: {
                    type: 'value',
                    max: 100,
                    ...axisStyle,
                  },
                  series: [{
                    type: 'bar',
                    data: doctors.map((d) => d.followRate),
                    barWidth: 18,
                    itemStyle: {
                      borderRadius: [3, 3, 0, 0],
                      color: {
                        type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
                        colorStops: [
                          { offset: 0, color: '#e8b84a' },
                          { offset: 1, color: '#2bb673' },
                        ],
                      },
                    },
                  }],
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
