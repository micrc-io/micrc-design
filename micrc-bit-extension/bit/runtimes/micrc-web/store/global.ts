/**
 * global store
 * i18n语言包，tracker埋点配置，token，integration
 */
import { create } from 'zustand';
import { subscribeWithSelector, persist } from 'zustand/middleware';
import mergeDeep from 'lodash.merge';

import type { I18nPointer, IntegrationTopic } from './index';

export const useGlobalStore = create(
  persist(
    subscribeWithSelector((set) => ({
      subject: {
        id: null,
        permissions: [],
      },
      workbench: '',
      i18n: null,
      tracker: null,
      integration: null,
      currentKey: '',
      error: {
        config: {
          custom: false,
          message: '',
          description: '',
        },
        message: '',
        description: '',
      },
      set,
    })),
    {
      name: 'micrc-storage',
    },
  ),
);
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

export const initModuleGlobalStore = (
  permissions: Array<string>,
  locale: string,
  workbench: string,
  i18n: Record<string, I18nPointer>,
  i18ns: Record<string, Record<string, I18nPointer | Record<string, I18nPointer>>> | null,
  tracker: any,
  integration: Record<string, IntegrationTopic>,
  currentKey?: string | '',
) => {
  const languages = {};
  // 客户端模块点位
  Object.values(i18n).forEach((pointer) => {
    Object.keys(pointer.defaults).forEach((it) => {
      if (!languages[it]) {
        languages[it] = {};
      }
      languages[it][pointer.key] = pointer.defaults[it];
    });
  });
  // 服务端聚合点位
  mergeDeep(languages, translateI18n(i18ns));

  useGlobalStore.setState({
    subject: {
      id: null,
      permissions: permissions || [],
    },
    workbench,
    i18n: {
      locale: locale || 'en_US',
      languages,
    },
    tracker,
    integration,
    currentKey: currentKey || '',
  });
};

export const initGlobalStore = (
  locale: string | null,
  workbench: string,
  i18n: Record<string, Record<string, I18nPointer | Record<string, I18nPointer>>> | null,
  i18ns: Record<string, Record<string, I18nPointer | Record<string, I18nPointer>>> | null,
  tracker: any | null,
  integration: Record<string, IntegrationTopic> | null,
  currentKey?: string | '',
) => {
  // const state: any = useGlobalStore.getState();
  const languages = translateI18n(i18n);
  mergeDeep(languages, translateI18n(i18ns));
  useGlobalStore.setState({
    i18n: {
      locale: locale || 'en_US',
      languages,
    },
  });

  useGlobalStore.setState({
    tracker,
  });

  useGlobalStore.setState({
    integration,
  });

  useGlobalStore.setState({
    currentKey,
  });

  useGlobalStore.setState({
    workbench,
  });
};
