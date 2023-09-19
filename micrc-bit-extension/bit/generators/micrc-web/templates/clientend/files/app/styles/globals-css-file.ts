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
::-webkit-scrollbar{
  width: 5px;
  height: 5px;
  background-color: rgb(253, 252, 252);
}
::-webkit-scrollbar-thumb{
  border-radius: 20px;
  background-color: rgb(228, 228, 231);
}
::-webkit-scrollbar-button{
  background-color: rgb(252, 252, 252);
  width: 5px;
}

#__next{
  height: 100%;
}
:where(.css-dev-only-do-not-override-1me4733).ant-menu-light.ant-menu-root.ant-menu-inline, :where(.css-dev-only-do-not-override-1me4733).ant-menu-light.ant-menu-root.ant-menu-vertical{
  border-inline-end: none;
}

.select .ant-skeleton-paragraph{
  margin: 0;
}
.select .ant-skeleton-paragraph li{
  width: 150px !important;
  height: 36px !important;
}
.ant-menu-item-group-title{
  text-align: left;
}

.ant-modal-root .ant-modal-wrap {
  top: 40px;
}
.ant-modal-root .\\/security\\/authc{
  top: 0px;
}
.authc-generic-layout_language__HFYHa{
  z-index: 9999999;
}
.ant-badge .ant-typography{
  margin: 0;
}
.ant-tabs-tab-active .ant-typography {
  color: #1677ff;
}
.ant-tabs-nav-list .ant-typography{
  margin: 0;
}
.ant-layout-sider .ant-tabs-content-holder{
  display: none;
}
.ant-layout-sider .ant-tabs-nav-list{
  width: 150px;
}
.ant-layout-sider .ant-tabs-nav-list .ant-tabs-tab {
  padding: 10px;
}
.ant-layout-sider .ant-tabs-left .ant-tabs-nav-wrap{
  white-space: normal;
}
.ant-tabs-left .ant-tabs-tab-btn {
  width: 150px;
  overflow-wrap: anywhere;
  text-align: left;
}

`;
}
