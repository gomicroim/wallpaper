import { useEffect, useMemo, useState } from 'react'
import DistrictScreen from './components/DistrictScreen'
import CommunityScreen from './components/CommunityScreen'
import {
  COMMUNITIES,
  DISTRICT_SUMMARY,
  FILTER_OPTIONS,
} from './data/mockData'
import './styles/dashboard.css'

function useStageScale() {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const update = () => {
      const sx = window.innerWidth / 1920
      const sy = window.innerHeight / 1080
      setScale(Math.min(sx, sy))
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return scale
}

function useClock() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  const pad = (n) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
}

export default function App() {
  const scale = useStageScale()
  const clock = useClock()

  const [role, setRole] = useState('district')
  const [view, setView] = useState('district')
  const [communityId, setCommunityId] = useState(COMMUNITIES[0].id)
  const [period, setPeriod] = useState('q2')
  const [age, setAge] = useState('all')
  const [gender, setGender] = useState('all')

  const periodLabel = FILTER_OPTIONS.periods.find((p) => p.id === period)?.label || ''

  const filters = useMemo(
    () => ({
      period,
      periodLabel,
      age,
      gender,
      districtTaggedRatio: DISTRICT_SUMMARY.taggedRatio,
    }),
    [period, periodLabel, age, gender]
  )

  const currentCommunity = COMMUNITIES.find((c) => c.id === communityId)

  const handleRoleChange = (nextRole) => {
    setRole(nextRole)
    if (nextRole === 'community') {
      setView('community')
    } else {
      setView('district')
    }
  }

  const enterCommunity = (id) => {
    if (role === 'community' && id !== communityId) return
    setCommunityId(id)
    setView('community')
  }

  const backToDistrict = () => {
    if (role === 'community') return
    setView('district')
  }

  return (
    <div className="app-shell">
      <div className="stage" style={{ transform: `scale(${scale})` }}>
        <div className="stage-decor" aria-hidden="true">
          <span className="corner tl" />
          <span className="corner tr" />
          <span className="corner bl" />
          <span className="corner br" />
        </div>
        <div className="header-banner" aria-hidden="true" />

        <header className="header header-classic">
          <div className="header-left">
            {view === 'community' && role === 'district' ? (
              <button className="back-btn" onClick={backToDistrict}>← 返回区级总览</button>
            ) : null}
            <div className="level-switch" title="演示分级权限切换">
              <button
                className={role === 'district' ? 'active' : ''}
                onClick={() => handleRoleChange('district')}
              >
                区级视图
              </button>
              <button
                className={role === 'community' ? 'active' : ''}
                onClick={() => handleRoleChange('community')}
              >
                社区级视图
              </button>
            </div>
          </div>

          <div className="header-center title-center">
            <div className="brand-eyebrow">杨浦区 · 家庭医生签约服务</div>
            <h1 className="brand-title">「三高一重」社区运动干预数据大屏</h1>
            <div className="clock">{clock}</div>
          </div>

          <div className="header-right">
            {role === 'community' || view === 'community' ? (
              <div className="org-badge">
                当前机构
                <strong>{currentCommunity?.name}</strong>
              </div>
            ) : null}
            {role === 'community' ? (
              <select
                value={communityId}
                onChange={(e) => setCommunityId(e.target.value)}
                title="演示：模拟切换登录机构"
              >
                {COMMUNITIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.short}</option>
                ))}
              </select>
            ) : null}
            <div className="filter-bar">
              <select value={period} onChange={(e) => setPeriod(e.target.value)}>
                {FILTER_OPTIONS.periods.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
              <select value={age} onChange={(e) => setAge(e.target.value)}>
                {FILTER_OPTIONS.ages.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
              <select value={gender} onChange={(e) => setGender(e.target.value)}>
                {FILTER_OPTIONS.genders.map((p) => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <div style={{ position: 'absolute', inset: '108px 0 0', overflow: 'hidden', zIndex: 2 }}>
          {view === 'district' ? (
            <DistrictScreen
              onEnterCommunity={enterCommunity}
              filters={filters}
            />
          ) : (
            <CommunityScreen
              communityId={communityId}
              onBack={backToDistrict}
              filters={filters}
              locked={role === 'community'}
            />
          )}
        </div>

        <div className="permission-tip">
          <span className="dot" />
          {role === 'district'
            ? '区级权限：可查看全区机构排名与横向对比，点击机构可下钻社区子屏'
            : '社区级权限：仅可查看本机构详细数据及家庭医生执行明细'}
        </div>
      </div>
    </div>
  )
}
