export function getTheme(isDark) {
  return {
    // ── PAGE BACKGROUNDS ──────────────────────────
    pageBg:          isDark ? '#0e0e0e'              : '#f4f6f8',
    surfaceBg:       isDark ? '#131313'              : '#ffffff',
    surfaceLow:      isDark ? '#1b1b1b'              : '#f0f2f5',
    surfaceCard:     isDark ? 'rgba(31,31,31,0.7)'   : 'rgba(255,255,255,0.9)',
    surfaceHigh:     isDark ? 'rgba(42,42,42,0.85)'  : 'rgba(240,242,246,0.95)',
    surfaceSidebar:  isDark ? 'rgba(8,8,8,0.97)'     : 'rgba(248,250,252,0.97)',
    surfaceModal:    isDark ? 'rgba(13,13,13,0.97)'  : 'rgba(252,253,255,0.98)',
    surfaceNavbar:   isDark ? 'rgba(0,0,0,0.9)'      : 'rgba(255,255,255,0.95)',
    surfaceSection:  isDark ? 'rgba(19,19,19,0.6)'   : 'rgba(255,255,255,0.8)',
    surfaceDidYouKnow: isDark ? 'rgba(255,215,0,0.06)' : 'rgba(255,215,0,0.08)',
    surfaceExample:  isDark ? 'rgba(19,19,19,0.6)'   : 'rgba(0,0,0,0.03)',
    surfaceFormula:  isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,212,255,0.04)',
    surfaceQuickCheck: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)',

    // ── TEXT COLORS ───────────────────────────────
    textPrimary:     isDark ? '#ffffff'              : '#0a1628',
    textSecondary:   isDark ? 'rgba(255,255,255,0.6)': '#444444',
    textMuted:       isDark ? 'rgba(255,255,255,0.35)': '#777777',
    textLabel:       isDark ? '#bbc9cf'              : '#555555',
    textPlaceholder: isDark ? 'rgba(255,255,255,0.2)': '#aaaaaa',
    textHeading:     isDark ? '#ffffff'              : '#0a1628',
    textBody:        isDark ? 'rgba(255,255,255,0.82)': '#333333',
    textCaption:     isDark ? 'rgba(255,255,255,0.4)': '#888888',
    textSummary:     isDark ? 'rgba(255,255,255,0.6)': '#555555',

    // ── BORDERS ───────────────────────────────────
    borderCard:      isDark ? 'rgba(0,212,255,0.15)' : 'rgba(0,150,200,0.2)',
    borderCardHover: isDark ? 'rgba(0,212,255,0.45)' : 'rgba(0,212,255,0.5)',
    borderSubtle:    isDark ? 'rgba(255,255,255,0.06)': 'rgba(0,0,0,0.08)',
    borderInput:     isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.15)',
    borderSidebar:   isDark ? 'rgba(255,255,255,0.05)': 'rgba(0,0,0,0.1)',
    borderNavbar:    isDark ? 'rgba(255,255,255,0.06)': 'rgba(0,0,0,0.1)',

    // ── SHADOWS ───────────────────────────────────
    shadowCard:      isDark 
      ? '0 0 40px rgba(0,212,255,0.06)' 
      : '0 4px 24px rgba(0,0,0,0.08)',
    shadowCardHover: isDark 
      ? '0 0 50px rgba(0,212,255,0.12)' 
      : '0 8px 40px rgba(0,212,255,0.14)',
    shadowSidebar:   isDark 
      ? 'none' 
      : '4px 0 24px rgba(0,0,0,0.08)',
    shadowNavbar:    isDark 
      ? '0 20px 40px rgba(0,212,255,0.03)' 
      : '0 1px 0 rgba(0,0,0,0.08)',
    shadowModal:     isDark 
      ? '0 32px 64px rgba(0,0,0,0.6)' 
      : '0 32px 64px rgba(0,0,0,0.14)',

    // ── ACCENT COLORS (same for both themes) ──────
    accentPhysics:   '#00d4ff',
    accentChemistry: isDark ? '#ffdd4c' : '#c49b00',
    accentBiology:   isDark ? '#39ff14' : '#1a9400',
    accentGold:      '#ffd700',
    accentRed:       isDark ? '#ff6b6b' : '#cc3333',

    // ── ICON BOX BACKGROUNDS ──────────────────────
    iconBgPhysics:   isDark 
      ? 'rgba(0,212,255,0.06)' 
      : 'rgba(0,212,255,0.08)',
    iconBgChemistry: isDark 
      ? 'rgba(255,221,76,0.06)' 
      : 'rgba(196,155,0,0.08)',
    iconBgBiology:   isDark 
      ? 'rgba(57,255,20,0.06)' 
      : 'rgba(26,148,0,0.08)',

    // ── BACKGROUND DECORATION ORBS ────────────────
    orbTopRight:    isDark 
      ? 'rgba(168,232,255,0.04)' 
      : 'rgba(0,180,220,0.06)',
    orbBottomLeft:  isDark 
      ? 'rgba(0,212,255,0.03)' 
      : 'rgba(0,150,200,0.05)',
    decorSquare1:   isDark 
      ? 'rgba(168,232,255,0.08)' 
      : 'rgba(0,150,200,0.12)',
    decorSquare2:   isDark 
      ? 'rgba(0,212,255,0.05)' 
      : 'rgba(0,150,200,0.08)',

    // ── GRID LINES ────────────────────────────────
    gridLine:       isDark 
      ? 'rgba(168,232,255,0.03)' 
      : 'rgba(0,100,150,0.05)',

    // ── INPUT FIELDS ──────────────────────────────
    inputBg:        'transparent',
    inputText:      isDark ? '#ffffff'    : '#0a1628',
    inputBorder:    isDark 
      ? 'rgba(255,255,255,0.1)' 
      : 'rgba(0,0,0,0.15)',
    inputFocus:     '#00d4ff',
    inputFocusGlow: isDark 
      ? 'rgba(0,212,255,0.25)' 
      : 'rgba(0,212,255,0.2)',

    // ── BUTTONS ───────────────────────────────────
    btnPrimaryBg:   '#00d4ff',
    btnPrimaryText: isDark ? '#003642' : '#003642',
    btnPrimaryHover:'#a8e8ff',

    // ── NAV ITEMS ─────────────────────────────────
    navInactive:    isDark ? '#555555'    : '#888888',
    navHover:       isDark ? '#bbc9cf'    : '#333333',
    navActive:      '#00d4ff',
    navActiveBg:    isDark 
      ? 'rgba(0,212,255,0.04)' 
      : 'rgba(0,212,255,0.06)',

    // ── TOGGLE SWITCHES ───────────────────────────
    toggleOff:      isDark 
      ? 'rgba(255,255,255,0.08)' 
      : 'rgba(0,0,0,0.1)',
    toggleThumbOff: isDark ? '#555555'    : 'rgba(0,0,0,0.3)',
    toggleOn:       '#00d4ff',
    toggleThumbOn:  isDark ? '#003642'    : '#ffffff',

    // ── PROGRESS BARS ─────────────────────────────
    progressTrack:  isDark 
      ? 'rgba(255,255,255,0.06)' 
      : 'rgba(0,0,0,0.08)',
    progressFill:   '#00d4ff',

    // ── SLIDERS ───────────────────────────────────
    sliderTrack:    isDark 
      ? 'rgba(255,255,255,0.08)' 
      : 'rgba(0,0,0,0.1)',
    sliderThumb:    '#00d4ff',

    // ── STATS CARDS ───────────────────────────────
    statCardBg:     isDark 
      ? 'rgba(19,19,19,0.6)' 
      : 'rgba(255,255,255,0.9)',
    statCardBorder: isDark 
      ? 'rgba(255,255,255,0.04)' 
      : 'rgba(0,0,0,0.07)',

    // ── METRIC ROW ────────────────────────────────
    metricBorder:   isDark 
      ? 'rgba(0,212,255,0.06)' 
      : 'rgba(0,150,200,0.1)',
    metricLabel:    isDark ? '#333333' : '#999999',

    // ── TOPIC MODAL ROWS ──────────────────────────
    topicRowBg:     isDark 
      ? 'rgba(255,255,255,0.02)' 
      : 'rgba(0,0,0,0.02)',
    topicRowHover:  isDark 
      ? 'rgba(255,255,255,0.04)' 
      : 'rgba(0,0,0,0.04)',
    topicRowBorder: isDark 
      ? 'rgba(255,255,255,0.05)' 
      : 'rgba(0,0,0,0.07)',

    // ── LOGO COLOR ────────────────────────────────
    logoColor:      isDark ? '#00d4ff' : '#0a1628',

    // ── SELECTION HIGHLIGHT ───────────────────────
    selectionBg:    'rgba(0,212,255,0.2)',

    // ── OVERLAY (sidebar backdrop) ────────────────
    overlayBg:      isDark 
      ? 'rgba(0,0,0,0.5)' 
      : 'rgba(0,0,0,0.25)',
  }
}
