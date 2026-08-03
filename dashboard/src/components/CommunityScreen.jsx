import { useMemo } from 'react'
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
  axisLine: { lineStyle: { color: 'rgba(138,216,255,0.25)' } },
  axisLabel: { color: '#8eb0d0', fontSize: 11 },
  splitLine: { lineStyle: { color: 'rgba(138,216,255,0.08)' } },
}

function rateClass(rate) {
  if (rate >= 90) return 'good'
  if (rate >= 80) return 'mid'
  return 'low'
}

export default function CommunityScreen({ communityId, filters, locked }) {
  const community = COMMUNITY_METRICS.find((c) => c.id === communityId) || COMMUNITY_METRICS[0]
  const doctors = DOCTORS_BY_COMMUNITY[community.id] || []
  const trend = COMMUNITY_TREND[community.id] || []

  const trendOption = useMemo(() => ({
    grid: { top: 36, right: 18, bottom: 28, left: 42 },
    legend: {
      top: 0,
      right: 0,
      textStyle: { color: '#8eb0d0', fontSize: 11 },
      itemWidth: 12,
      itemHeight: 8,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(6,28,58,0.94)',
      borderColor: 'rgba(62,198,255,0.35)',
      textStyle: { color: '#eaf4ff', fontSize: 12 },
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
      nameTextStyle: { color: '#5d7fa0', fontSize: 11 },
      ...axisStyle,
    },
    series: [
      {
        name: '戒烟完成率',
        type: 'line',
        smooth: true,
        data: trend.map((d) => d.smoke),
        areaStyle: { color: 'rgba(62,198,255,0.08)' },
        lineStyle: { width: 2, color: '#3ec6ff' },
        itemStyle: { color: '#3ec6ff' },
      },
      {
        name: '推送覆盖率',
        type: 'line',
        smooth: true,
        data: trend.map((d) => d.diet),
        lineStyle: { width: 2, color: '#2fd4a2' },
        itemStyle: { color: '#2fd4a2' },
      },
      {
        name: '随访管理率',
        type: 'line',
        smooth: true,
        data: trend.map((d) => d.follow),
        lineStyle: { width: 2, color: '#f0c35a' },
        itemStyle: { color: '#f0c35a' },
      },
    ],
  }), [trend])

  const ageOption = useMemo(() => ({
    tooltip: { trigger: 'item', backgroundColor: 'rgba(6,28,58,0.94)', borderColor: 'rgba(62,198,255,0.35)', textStyle: { color: '#eaf4ff' } },
    legend: { bottom: 0, itemWidth: 8, itemHeight: 8, textStyle: { color: '#8eb0d0', fontSize: 10 } },
    series: [{
      type: 'pie',
      radius: ['34%', '58%'],
      center: ['50%', '42%'],
      label: { color: '#cfe7ea', formatter: '{b}\n{d}%', fontSize: 10 },
      data: AGE_DISTRIBUTION.map((d, i) => ({
        ...d,
        itemStyle: { color: ['#1f6fbf', '#2f7dff', '#3ec6ff', '#2fd4a2', '#f0c35a'][i] },
      })),
    }],
  }), [])

  const genderOption = useMemo(() => ({
    grid: { top: 24, right: 10, bottom: 24, left: 28 },
    xAxis: { type: 'category', data: GENDER_DISTRIBUTION.map((d) => d.name), ...axisStyle },
    yAxis: { type: 'value', max: 100, ...axisStyle, axisLabel: { ...axisStyle.axisLabel, fontSize: 10 } },
    series: [{
      type: 'bar',
      data: GENDER_DISTRIBUTION.map((d) => d.value),
      barWidth: 28,
      itemStyle: {
        borderRadius: [3, 3, 0, 0],
        color: (params) => (params.dataIndex === 0 ? '#3ec6ff' : '#2fd4a2'),
      },
      label: { show: true, position: 'top', color: '#cfe7ea', formatter: '{c}%', fontSize: 10 },
    }],
  }), [])

  return (
    <div className="screen">
      <div className="kpi-row kpi-5">
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
          <div className="panel">
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
              <span className="hint">年龄 / 性别 / 标签一屏展示</span>
            </div>
            <div className="panel-body">
              <div className="compose-full">
                <div className="compose-block">
                  <h4>年龄分布</h4>
                  <Chart option={ageOption} />
                </div>
                <div className="compose-block">
                  <h4>性别分布</h4>
                  <Chart option={genderOption} />
                </div>
                <div className="compose-block">
                  <h4>标签构成</h4>
                  <div className="compose-tags">
                    {TAG_BREAKDOWN.map((t, i) => (
                      <div key={t.name} className="follow-card">
                        <div className="label">{t.name}</div>
                        <div className="num" style={{ color: ['#ff7a66', '#f0c35a', '#3ec6ff', '#2fd4a2'][i] }}>
                          {Math.round(community.tagged * t.value / 100)}
                        </div>
                        <div className="sub">占比 {t.value}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
                      <th>分管标签对象</th>
                      <th>戒烟调查</th>
                      <th>建议书推送</th>
                      <th>高血压随访</th>
                      <th>糖尿病随访</th>
                      <th>高血脂随访</th>
                      <th>超重肥胖随访</th>
                      <th>已随访</th>
                      <th>未随访</th>
                      <th>随访完成率</th>
                    </tr>
                  </thead>
                  <tbody>
                    {doctors.map((d) => (
                      <tr key={d.id}>
                        <td>{d.name}</td>
                        <td className="num">{d.assigned}</td>
                        <td>
                          <span className={`rate-pill ${rateClass(d.smokeRate)}`}>{d.smokeRate}%</span>
                        </td>
                        <td>
                          <span className={`rate-pill ${rateClass(d.dietRate)}`}>{d.dietRate}%</span>
                        </td>
                        <td className="num">{d.htnFollow}<span style={{ color: '#5d7fa0' }}>/{d.htn}</span></td>
                        <td className="num">{d.dmFollow}<span style={{ color: '#5d7fa0' }}>/{d.dm}</span></td>
                        <td className="num">{d.lipidFollow}<span style={{ color: '#5d7fa0' }}>/{d.lipid}</span></td>
                        <td className="num">{d.obesityFollow}<span style={{ color: '#5d7fa0' }}>/{d.obesity}</span></td>
                        <td className="num" style={{ color: '#6ee7c0' }}>{d.followDone}</td>
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
                    backgroundColor: 'rgba(6,28,58,0.94)',
                    borderColor: 'rgba(62,198,255,0.35)',
                    textStyle: { color: '#eaf4ff', fontSize: 12 },
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
                          { offset: 0, color: '#3ec6ff' },
                          { offset: 1, color: '#2f7dff' },
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
