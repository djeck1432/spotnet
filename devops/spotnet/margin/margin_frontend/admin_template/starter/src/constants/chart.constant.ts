import { theme } from 'twin.macro'

const twColor: Record<string, string> = theme`colors`

export const COLOR_1 = twColor.indigo['600']
export const COLOR_2 = twColor.blue['500']
export const COLOR_3 = twColor.emerald['500']
export const COLOR_4 = twColor.amber['500']
export const COLOR_5 = twColor.red['500']
export const COLOR_6 = twColor.purple['500']
export const COLOR_7 = twColor.cyan['500']

export const COLOR_1_LIGHT = twColor.indigo['100']
export const COLOR_2_LIGHT = twColor.blue['100']
export const COLOR_3_LIGHT = twColor.emerald['100']
export const COLOR_4_LIGHT = twColor.amber['100']
export const COLOR_5_LIGHT = twColor.red['100']
export const COLOR_6_LIGHT = twColor.purple['100']
export const COLOR_7_LIGHT = twColor.cyan['100']

export const COLORS = [
    COLOR_1,
    COLOR_2,
    COLOR_3,
    COLOR_4,
    COLOR_5,
    COLOR_6,
    COLOR_7,
]

export const COLORS_LIGHT = [
    COLOR_1_LIGHT,
    COLOR_2_LIGHT,
    COLOR_3_LIGHT,
    COLOR_4_LIGHT,
    COLOR_5_LIGHT,
    COLOR_6_LIGHT,
    COLOR_7_LIGHT,
]
