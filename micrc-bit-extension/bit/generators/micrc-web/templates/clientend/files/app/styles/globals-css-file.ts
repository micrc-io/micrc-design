/**
 * app/styles/globals.css
 */

export function appGlobalCssFile() {
  return `html,
body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}

::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: rgb(253, 252, 252);
}

::-webkit-scrollbar-thumb {
  border-radius: 20px;
  background-color: rgb(228, 228, 231);
}

::-webkit-scrollbar-button {
  background-color: rgb(252, 252, 252);
  width: 5px;
}

#__next {
  height: 100%;
}

:where(.css-dev-only-do-not-override-1me4733).ant-menu-light.ant-menu-root.ant-menu-inline,
:where(.css-dev-only-do-not-override-1me4733).ant-menu-light.ant-menu-root.ant-menu-vertical {
  border-inline-end: none;
}

.ant-layout>.ant-layout-sider {
  min-height: 600px;
}

.ant-layout>.ant-layout {
  min-height: 600px;
}

.ant-layout-content .ant-layout>.ant-layout-sider {
  min-height: 0;
}

.select .ant-skeleton-paragraph {
  margin: 0;
}

.select .ant-skeleton-paragraph li {
  width: 150px !important;
  height: 36px !important;
}

.ant-menu-item-group-title {
  text-align: left;
}

.ant-modal-wrap .react-draggable {
  z-index: 99;
}

.ant-modal-root .\\/security\\/authc {
  top: 0px;
}

.authc-generic-layout_language__HFYHa {
  z-index: 9999999;
  height: 30px;
  line-height: 0;
}

.ant-badge .ant-typography {
  margin: 0;
}

.ant-tabs-tab-active .ant-typography {
  color: #1677ff;
}

.ant-tabs-left {
  height: 100%;
}

.ant-layout-sider .ant-tabs-nav .ant-tabs-tab {
  padding: 0px;
}

.admin-generic-layout_sider__MxJmz{
  z-index: 1050;
}

.ant-tabs-nav-list .ant-typography{
  margin-bottom: 0px;
}

.sider-layout_tabsContent__Mrxt_ .ant-layout-sider-children .blankContent {
  height: 100%;
}


:where(.css-dev-only-do-not-override-1w4v3hc).ant-menu-light.ant-menu-root.ant-menu-inline,
:where(.css-dev-only-do-not-override-1w4v3hc).ant-menu-light>.ant-menu.ant-menu-root.ant-menu-inline,
:where(.css-dev-only-do-not-override-1w4v3hc).ant-menu-light.ant-menu-root.ant-menu-vertical,
:where(.css-dev-only-do-not-override-1w4v3hc).ant-menu-light>.ant-menu.ant-menu-root.ant-menu-vertical {
  border-inline-end: none;
}

.ant-timeline.ant-timeline-label .ant-timeline-item-label {
  width: 25%;
}

.ant-timeline.ant-timeline-label .ant-timeline-item-left .ant-timeline-item-content {
  inset-inline-start: calc(35% - 4px);
  width: calc(50% - 12px);
}

.ant-timeline.ant-timeline-label .ant-timeline-item-tail {
  inset-inline-start: 30%;
}

.ant-timeline.ant-timeline-label .ant-timeline-item-head {
  inset-inline-start: 30%;
}
`;
}
