const STORAGE_KEY = 'layout_preferences'

interface LayoutPrefs {
  sidebarCollapsedByDefault: boolean
  sidebarSectionsCollapsedByDefault: boolean
}

function defaults(): LayoutPrefs {
  return {
    sidebarCollapsedByDefault: false,
    sidebarSectionsCollapsedByDefault: false,
  }
}

function readPrefs(): Partial<LayoutPrefs> | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Partial<LayoutPrefs>) : null
  } catch {
    return null
  }
}

function writePrefs(prefs: LayoutPrefs): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch {
    /* quota / private mode */
  }
}

export function readSidebarCollapsedDefault(): boolean {
  return readPrefs()?.sidebarCollapsedByDefault ?? false
}

export function readSidebarSectionsCollapsedDefault(): boolean {
  return readPrefs()?.sidebarSectionsCollapsedByDefault ?? false
}

export function persistSidebarCollapsed(collapsed: boolean): void {
  writePrefs({ ...defaults(), ...readPrefs(), sidebarCollapsedByDefault: collapsed })
}
