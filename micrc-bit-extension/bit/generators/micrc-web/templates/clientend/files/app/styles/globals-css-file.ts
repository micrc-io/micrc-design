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

`;
}
