/* eslint-disable @typescript-eslint/no-shadow */
/**
 * global store
 * i18n语言包，tracker埋点配置，token，integration
 */
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import type { I18nPointer, IntegrationTopic } from './index';

export const useGlobalStore = create(subscribeWithSelector((set) => ({
  subject: {
    id: null,
    permissions: [],
  },
  i18n: null,
  tracker: null,
  integration: null,
  currentKey: '',
  set,
})));

export const initModuleGlobalStore = (
  permissions: Array<string>,
  locale: string,
  i18n: Record<string, I18nPointer>,
  tracker: any,
  integration: Record<string, IntegrationTopic>,
  currentKey?: string | '',
) => {
  const languages = {};
  Object.values(i18n).forEach((pointer) => {
    Object.keys(pointer.defaults).forEach((it) => {
      if (!languages[it]) {
        languages[it] = {};
      }
      languages[it][pointer.key] = pointer.defaults[it];
    });
  });
  useGlobalStore.setState({
    subject: {
      permissions: permissions || [],
    },
    i18n: {
      locale: locale || 'en_US',
      languages,
    },
    tracker,
    integration,
    currentKey: currentKey || '',
  });
};

const translateI18n = (
  i18n: Record<string, Record<string, I18nPointer | Record<string, I18nPointer>>>,
) => {
  const languages = {};
  Object.keys(i18n).forEach((pageUri) => {
    Object.keys(i18n[pageUri]).forEach((moduleId) => {
      Object.values(i18n[pageUri][moduleId]).forEach((pointer) => {
        Object.keys(pointer.defaults).forEach((it) => {
          if (!languages[it]) {
            languages[it] = {};
          }
          if (!languages[it][pageUri]) {
            languages[it][pageUri] = {};
          }
          if (!languages[it][pageUri][moduleId]) {
            languages[it][pageUri][moduleId] = {};
          }
          languages[it][pageUri][moduleId][pointer.key] = pointer.defaults[it];
        });
      });
    });
  });
  return languages;
};

export const initGlobalStore = (
  locale: string | null,
  i18n: Record<string, Record<string, I18nPointer | Record<string, I18nPointer>>> | null,
  tracker: any | null,
  integration: Record<string, IntegrationTopic> | null,
  currentKey?: string | '',
) => {
  const state: any = useGlobalStore.getState();
  if (!state.i18n && i18n) {
    useGlobalStore.setState({
      i18n: {
        locale: locale || 'en_US',
        languages: translateI18n(i18n),
      },
    });
  }
  if (!state.tracker && tracker) {
    useGlobalStore.setState({
      tracker,
    });
  }
  if (!state.integration && integration) {
    useGlobalStore.setState({
      integration,
    });
  }
  if (!state.currentKey && currentKey) {
    useGlobalStore.setState({
      currentKey,
    });
  }
};
