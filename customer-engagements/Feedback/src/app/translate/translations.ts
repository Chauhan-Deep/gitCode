import { InjectionToken } from '@angular/core';

import { LANG_CS_CZ_NAME, LANG_CS_CZ_TRANS } from './i18n/cs-CZ';
import { LANG_DA_DK_NAME, LANG_DA_DK_TRANS } from './i18n/da-DK';
import { LANG_DE_DE_NAME, LANG_DE_DE_TRANS } from './i18n/de-DE';
import { LANG_EN_GB_NAME, LANG_EN_GB_TRANS } from './i18n/en-GB';
import { LANG_EN_US_NAME, LANG_EN_US_TRANS } from './i18n/en-US';
import { LANG_ES_ES_NAME, LANG_ES_ES_TRANS } from './i18n/es-ES';
import { LANG_FI_FI_NAME, LANG_FI_FI_TRANS } from './i18n/fi-FI';
import { LANG_FR_FR_NAME, LANG_FR_FR_TRANS } from './i18n/fr-FR';
import { LANG_IT_IT_NAME, LANG_IT_IT_TRANS } from './i18n/it-IT';
import { LANG_JA_JP_NAME, LANG_JA_JP_TRANS } from './i18n/ja-JP';
import { LANG_KO_KR_NAME, LANG_KO_KR_TRANS } from './i18n/ko-KR';
import { LANG_NB_NO_NAME, LANG_NB_NO_TRANS } from './i18n/nb-NO';
import { LANG_NL_NL_NAME, LANG_NL_BE_NAME, LANG_NL_NL_TRANS } from './i18n/nl-NL';
import { LANG_PL_PL_NAME, LANG_PL_PL_TRANS } from './i18n/pl-PL';
import { LANG_PT_BR_NAME, LANG_PT_BR_TRANS } from './i18n/pt-BR';
import { LANG_PT_PT_NAME, LANG_PT_PT_TRANS } from './i18n/pt-PT';
import { LANG_RU_RU_NAME, LANG_RU_RU_TRANS } from './i18n/ru-RU';
import { LANG_SV_SE_NAME, LANG_SV_SE_TRANS } from './i18n/sv-SE';
import { LANG_ZH_CHS_NAME, LANG_ZH_CHS_TRANS } from './i18n/zh-CHS';
import { LANG_ZH_CHT_NAME, LANG_ZH_CHT_TRANS } from './i18n/zh-CHT';

export const TRANSLATIONS = new InjectionToken('translations');

export const dictionary = {
    [LANG_CS_CZ_NAME]: LANG_CS_CZ_TRANS,
    [LANG_DA_DK_NAME]: LANG_DA_DK_TRANS,
    [LANG_DE_DE_NAME]: LANG_DE_DE_TRANS,
    [LANG_EN_GB_NAME]: LANG_EN_GB_TRANS,
    [LANG_EN_US_NAME]: LANG_EN_US_TRANS,
    [LANG_ES_ES_NAME]: LANG_ES_ES_TRANS,
    [LANG_FI_FI_NAME]: LANG_FI_FI_TRANS,
    [LANG_FR_FR_NAME]: LANG_FR_FR_TRANS,
    [LANG_IT_IT_NAME]: LANG_IT_IT_TRANS,
    [LANG_JA_JP_NAME]: LANG_JA_JP_TRANS,
    [LANG_KO_KR_NAME]: LANG_KO_KR_TRANS,
    [LANG_NB_NO_NAME]: LANG_NB_NO_TRANS,
    [LANG_NL_NL_NAME]: LANG_NL_NL_TRANS,
    [LANG_PL_PL_NAME]: LANG_PL_PL_TRANS,
    [LANG_PT_BR_NAME]: LANG_PT_BR_TRANS,
    [LANG_PT_PT_NAME]: LANG_PT_PT_TRANS,
    [LANG_RU_RU_NAME]: LANG_RU_RU_TRANS,
    [LANG_SV_SE_NAME]: LANG_SV_SE_TRANS,
    [LANG_ZH_CHS_NAME]: LANG_ZH_CHS_TRANS,
    [LANG_ZH_CHT_NAME]: LANG_ZH_CHT_TRANS,
    [LANG_NL_BE_NAME]: LANG_NL_NL_TRANS
};

export const TRANSLATION_PROVIDERS = [
    { provide: TRANSLATIONS, useValue: dictionary },
];
