export type CircleId = 'love' | 'goodAt' | 'worldNeeds' | 'paidFor'
export type IntersectionId = 'passion' | 'mission' | 'vocation' | 'profession'

export interface CircleItem {
  id: string
  text: string
  starred: boolean
  createdAt: string
}

export interface IntersectionData {
  text: string
  notFound: boolean
  updatedAt?: string
}

export interface MissionHistoryEntry {
  id: string
  text: string
  savedAt: string
}

export interface IkigaiState {
  version: 1
  activeStep: number
  circles: {
    love: CircleItem[]
    goodAt: CircleItem[]
    worldNeeds: CircleItem[]
    paidFor: CircleItem[]
  }
  intersections: {
    passion: IntersectionData
    mission: IntersectionData
    vocation: IntersectionData
    profession: IntersectionData
  }
  missionStatement: string
  missionHistory: MissionHistoryEntry[]
  rawRetratoTray?: string[] // compatibilidade retroativa com versões anteriores
  updatedAt: string
}

export interface EmptyIntersectionsDiagnostic {
  hasAnyEmpty: boolean
  emptyKeys: IntersectionId[]
  combinationKey: string
  dominantCircle: CircleId | null
  leanestCircle: CircleId | null
  circleCounts: Record<CircleId, number>
  primaryReflection: {
    title: string
    body: string
    guidance: string
  }
  reflectionCards: Array<{
    id: string
    title: string
    body: string
    kind: 'warning' | 'info' | 'encouragement'
  }>
  discussionQuestions: string[]
}
