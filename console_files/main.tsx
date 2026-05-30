import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=bd70c129"; const _jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import __vite__cjsImport1_react from "/node_modules/.vite/deps/react.js?v=bd70c129"; const React = __vite__cjsImport1_react.__esModule ? __vite__cjsImport1_react.default : __vite__cjsImport1_react;
import __vite__cjsImport2_reactDom_client from "/node_modules/.vite/deps/react-dom_client.js?v=bd70c129"; const ReactDOM = __vite__cjsImport2_reactDom_client.__esModule ? __vite__cjsImport2_reactDom_client.default : __vite__cjsImport2_reactDom_client;
import App from "/src/App.tsx?t=1780169646003";
import { ThemeProvider, createTheme } from "/node_modules/.vite/deps/@mui_material_styles.js?v=bd70c129";
import CssBaseline from "/node_modules/.vite/deps/@mui_material_CssBaseline.js?v=bd70c129";
// Create a premium, custom dark theme
const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#6366f1',
            light: '#818cf8',
            dark: '#4f46e5',
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#10b981',
            light: '#34d399',
            dark: '#059669',
            contrastText: '#ffffff'
        },
        background: {
            default: '#0f1115',
            paper: '#181b21'
        },
        text: {
            primary: '#f3f4f6',
            secondary: '#9ca3af',
            disabled: '#4b5563'
        },
        divider: 'rgba(255, 255, 255, 0.08)'
    },
    typography: {
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        h1: {
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontWeight: 800
        },
        h2: {
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontWeight: 700
        },
        h3: {
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontWeight: 700
        },
        h4: {
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontWeight: 700
        },
        h5: {
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontWeight: 600
        },
        h6: {
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontWeight: 600
        },
        subtitle1: {
            fontWeight: 500
        },
        subtitle2: {
            fontWeight: 500
        },
        button: {
            fontFamily: '"Plus Jakarta Sans", sans-serif',
            textTransform: 'none',
            fontWeight: 600
        }
    },
    shape: {
        borderRadius: 12
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: `
        body {
          scrollbar-width: thin;
          scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
        }
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 999px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: '10px',
                    padding: '8px 16px',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
                        transform: 'translateY(-1px)'
                    },
                    '&:active': {
                        transform: 'translateY(0)'
                    }
                },
                containedSecondary: {
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                    }
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                }
            }
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    transition: 'all 0.2s ease-in-out',
                    '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.08)'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.15)'
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#6366f1'
                    }
                }
            }
        }
    }
});
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/ _jsxDEV(React.StrictMode, {
    children: /*#__PURE__*/ _jsxDEV(ThemeProvider, {
        theme: theme,
        children: [
            /*#__PURE__*/ _jsxDEV(CssBaseline, {}, void 0, false, {
                fileName: "/Users/prajulsahu/Developer/ollama-web-ui/client/src/main.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ _jsxDEV(App, {}, void 0, false, {
                fileName: "/Users/prajulsahu/Developer/ollama-web-ui/client/src/main.tsx",
                lineNumber: 129,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "/Users/prajulsahu/Developer/ollama-web-ui/client/src/main.tsx",
        lineNumber: 127,
        columnNumber: 5
    }, this)
}, void 0, false, {
    fileName: "/Users/prajulsahu/Developer/ollama-web-ui/client/src/main.tsx",
    lineNumber: 126,
    columnNumber: 3
}, this));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4udHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tL2NsaWVudCc7XG5pbXBvcnQgQXBwIGZyb20gJy4vQXBwJztcbmltcG9ydCB7IFRoZW1lUHJvdmlkZXIsIGNyZWF0ZVRoZW1lIH0gZnJvbSAnQG11aS9tYXRlcmlhbC9zdHlsZXMnO1xuaW1wb3J0IENzc0Jhc2VsaW5lIGZyb20gJ0BtdWkvbWF0ZXJpYWwvQ3NzQmFzZWxpbmUnO1xuXG4vLyBDcmVhdGUgYSBwcmVtaXVtLCBjdXN0b20gZGFyayB0aGVtZVxuY29uc3QgdGhlbWUgPSBjcmVhdGVUaGVtZSh7XG4gIHBhbGV0dGU6IHtcbiAgICBtb2RlOiAnZGFyaycsXG4gICAgcHJpbWFyeToge1xuICAgICAgbWFpbjogJyM2MzY2ZjEnLCAvLyBTbGVlayBSb3lhbCBJbmRpZ29cbiAgICAgIGxpZ2h0OiAnIzgxOGNmOCcsXG4gICAgICBkYXJrOiAnIzRmNDZlNScsXG4gICAgICBjb250cmFzdFRleHQ6ICcjZmZmZmZmJyxcbiAgICB9LFxuICAgIHNlY29uZGFyeToge1xuICAgICAgbWFpbjogJyMxMGI5ODEnLCAvLyBFbWVyYWxkIGFjY2VudHNcbiAgICAgIGxpZ2h0OiAnIzM0ZDM5OScsXG4gICAgICBkYXJrOiAnIzA1OTY2OScsXG4gICAgICBjb250cmFzdFRleHQ6ICcjZmZmZmZmJyxcbiAgICB9LFxuICAgIGJhY2tncm91bmQ6IHtcbiAgICAgIGRlZmF1bHQ6ICcjMGYxMTE1JywgLy8gT2JzaWRpYW4gc2xhdGVcbiAgICAgIHBhcGVyOiAnIzE4MWIyMScsIC8vIERhcmsgY2FyZCBiYWNrZ3JvdW5kXG4gICAgfSxcbiAgICB0ZXh0OiB7XG4gICAgICBwcmltYXJ5OiAnI2YzZjRmNicsIC8vIEJyaWdodCBzb2Z0IHdoaXRlXG4gICAgICBzZWNvbmRhcnk6ICcjOWNhM2FmJywgLy8gR3JheSB0ZXh0XG4gICAgICBkaXNhYmxlZDogJyM0YjU1NjMnLFxuICAgIH0sXG4gICAgZGl2aWRlcjogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC4wOCknLFxuICB9LFxuICB0eXBvZ3JhcGh5OiB7XG4gICAgZm9udEZhbWlseTogJ1wiSW50ZXJcIiwgLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCBcIlNlZ29lIFVJXCIsIFJvYm90bywgc2Fucy1zZXJpZicsXG4gICAgaDE6IHsgZm9udEZhbWlseTogJ1wiUGx1cyBKYWthcnRhIFNhbnNcIiwgc2Fucy1zZXJpZicsIGZvbnRXZWlnaHQ6IDgwMCB9LFxuICAgIGgyOiB7IGZvbnRGYW1pbHk6ICdcIlBsdXMgSmFrYXJ0YSBTYW5zXCIsIHNhbnMtc2VyaWYnLCBmb250V2VpZ2h0OiA3MDAgfSxcbiAgICBoMzogeyBmb250RmFtaWx5OiAnXCJQbHVzIEpha2FydGEgU2Fuc1wiLCBzYW5zLXNlcmlmJywgZm9udFdlaWdodDogNzAwIH0sXG4gICAgaDQ6IHsgZm9udEZhbWlseTogJ1wiUGx1cyBKYWthcnRhIFNhbnNcIiwgc2Fucy1zZXJpZicsIGZvbnRXZWlnaHQ6IDcwMCB9LFxuICAgIGg1OiB7IGZvbnRGYW1pbHk6ICdcIlBsdXMgSmFrYXJ0YSBTYW5zXCIsIHNhbnMtc2VyaWYnLCBmb250V2VpZ2h0OiA2MDAgfSxcbiAgICBoNjogeyBmb250RmFtaWx5OiAnXCJQbHVzIEpha2FydGEgU2Fuc1wiLCBzYW5zLXNlcmlmJywgZm9udFdlaWdodDogNjAwIH0sXG4gICAgc3VidGl0bGUxOiB7IGZvbnRXZWlnaHQ6IDUwMCB9LFxuICAgIHN1YnRpdGxlMjogeyBmb250V2VpZ2h0OiA1MDAgfSxcbiAgICBidXR0b246IHtcbiAgICAgIGZvbnRGYW1pbHk6ICdcIlBsdXMgSmFrYXJ0YSBTYW5zXCIsIHNhbnMtc2VyaWYnLFxuICAgICAgdGV4dFRyYW5zZm9ybTogJ25vbmUnLFxuICAgICAgZm9udFdlaWdodDogNjAwLFxuICAgIH0sXG4gIH0sXG4gIHNoYXBlOiB7XG4gICAgYm9yZGVyUmFkaXVzOiAxMiwgLy8gTW9kZXJuIHJvdW5kZWQgbGF5b3V0XG4gIH0sXG4gIGNvbXBvbmVudHM6IHtcbiAgICBNdWlDc3NCYXNlbGluZToge1xuICAgICAgc3R5bGVPdmVycmlkZXM6IGBcbiAgICAgICAgYm9keSB7XG4gICAgICAgICAgc2Nyb2xsYmFyLXdpZHRoOiB0aGluO1xuICAgICAgICAgIHNjcm9sbGJhci1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjE1KSB0cmFuc3BhcmVudDtcbiAgICAgICAgfVxuICAgICAgICA6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgICAgICAgICB3aWR0aDogNnB4O1xuICAgICAgICAgIGhlaWdodDogNnB4O1xuICAgICAgICB9XG4gICAgICAgIDo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sge1xuICAgICAgICAgIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICAgICAgICB9XG4gICAgICAgIDo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xuICAgICAgICAgIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xNSk7XG4gICAgICAgICAgYm9yZGVyLXJhZGl1czogOTk5cHg7XG4gICAgICAgIH1cbiAgICAgICAgOjotd2Via2l0LXNjcm9sbGJhci10aHVtYjpob3ZlciB7XG4gICAgICAgICAgYmFja2dyb3VuZDogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjMpO1xuICAgICAgICB9XG4gICAgICBgLFxuICAgIH0sXG4gICAgTXVpQnV0dG9uOiB7XG4gICAgICBzdHlsZU92ZXJyaWRlczoge1xuICAgICAgICByb290OiB7XG4gICAgICAgICAgYm9yZGVyUmFkaXVzOiAnMTBweCcsXG4gICAgICAgICAgcGFkZGluZzogJzhweCAxNnB4JyxcbiAgICAgICAgICB0cmFuc2l0aW9uOiAnYWxsIDAuMnMgY3ViaWMtYmV6aWVyKDAuNCwgMCwgMC4yLCAxKScsXG4gICAgICAgICAgYm94U2hhZG93OiAnbm9uZScsXG4gICAgICAgICAgJyY6aG92ZXInOiB7XG4gICAgICAgICAgICBib3hTaGFkb3c6ICcwIDRweCAxMnB4IHJnYmEoOTksIDEwMiwgMjQxLCAwLjI1KScsXG4gICAgICAgICAgICB0cmFuc2Zvcm06ICd0cmFuc2xhdGVZKC0xcHgpJyxcbiAgICAgICAgICB9LFxuICAgICAgICAgICcmOmFjdGl2ZSc6IHtcbiAgICAgICAgICAgIHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVkoMCknLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIGNvbnRhaW5lZFNlY29uZGFyeToge1xuICAgICAgICAgICcmOmhvdmVyJzoge1xuICAgICAgICAgICAgYm94U2hhZG93OiAnMCA0cHggMTJweCByZ2JhKDE2LCAxODUsIDEyOSwgMC4yNSknLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgTXVpUGFwZXI6IHtcbiAgICAgIHN0eWxlT3ZlcnJpZGVzOiB7XG4gICAgICAgIHJvb3Q6IHtcbiAgICAgICAgICBiYWNrZ3JvdW5kSW1hZ2U6ICdub25lJywgLy8gUmVtb3ZlIGRlZmF1bHQgTVVJIG92ZXJsYXkgZ3JhZGllbnRcbiAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KScsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgTXVpT3V0bGluZWRJbnB1dDoge1xuICAgICAgc3R5bGVPdmVycmlkZXM6IHtcbiAgICAgICAgcm9vdDoge1xuICAgICAgICAgIHRyYW5zaXRpb246ICdhbGwgMC4ycyBlYXNlLWluLW91dCcsXG4gICAgICAgICAgJyYgLk11aU91dGxpbmVkSW5wdXQtbm90Y2hlZE91dGxpbmUnOiB7XG4gICAgICAgICAgICBib3JkZXJDb2xvcjogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC4wOCknLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJyY6aG92ZXIgLk11aU91dGxpbmVkSW5wdXQtbm90Y2hlZE91dGxpbmUnOiB7XG4gICAgICAgICAgICBib3JkZXJDb2xvcjogJ3JnYmEoMjU1LCAyNTUsIDI1NSwgMC4xNSknLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgJyYuTXVpLWZvY3VzZWQgLk11aU91dGxpbmVkSW5wdXQtbm90Y2hlZE91dGxpbmUnOiB7XG4gICAgICAgICAgICBib3JkZXJDb2xvcjogJyM2MzY2ZjEnLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KTtcblxuUmVhY3RET00uY3JlYXRlUm9vdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncm9vdCcpISkucmVuZGVyKFxuICA8UmVhY3QuU3RyaWN0TW9kZT5cbiAgICA8VGhlbWVQcm92aWRlciB0aGVtZT17dGhlbWV9PlxuICAgICAgPENzc0Jhc2VsaW5lIC8+XG4gICAgICA8QXBwIC8+XG4gICAgPC9UaGVtZVByb3ZpZGVyPlxuICA8L1JlYWN0LlN0cmljdE1vZGU+LFxuKTsiXSwibmFtZXMiOlsiUmVhY3QiLCJSZWFjdERPTSIsIkFwcCIsIlRoZW1lUHJvdmlkZXIiLCJjcmVhdGVUaGVtZSIsIkNzc0Jhc2VsaW5lIiwidGhlbWUiLCJwYWxldHRlIiwibW9kZSIsInByaW1hcnkiLCJtYWluIiwibGlnaHQiLCJkYXJrIiwiY29udHJhc3RUZXh0Iiwic2Vjb25kYXJ5IiwiYmFja2dyb3VuZCIsImRlZmF1bHQiLCJwYXBlciIsInRleHQiLCJkaXNhYmxlZCIsImRpdmlkZXIiLCJ0eXBvZ3JhcGh5IiwiZm9udEZhbWlseSIsImgxIiwiZm9udFdlaWdodCIsImgyIiwiaDMiLCJoNCIsImg1IiwiaDYiLCJzdWJ0aXRsZTEiLCJzdWJ0aXRsZTIiLCJidXR0b24iLCJ0ZXh0VHJhbnNmb3JtIiwic2hhcGUiLCJib3JkZXJSYWRpdXMiLCJjb21wb25lbnRzIiwiTXVpQ3NzQmFzZWxpbmUiLCJzdHlsZU92ZXJyaWRlcyIsIk11aUJ1dHRvbiIsInJvb3QiLCJwYWRkaW5nIiwidHJhbnNpdGlvbiIsImJveFNoYWRvdyIsInRyYW5zZm9ybSIsImNvbnRhaW5lZFNlY29uZGFyeSIsIk11aVBhcGVyIiwiYmFja2dyb3VuZEltYWdlIiwiYm9yZGVyIiwiTXVpT3V0bGluZWRJbnB1dCIsImJvcmRlckNvbG9yIiwiY3JlYXRlUm9vdCIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJyZW5kZXIiLCJTdHJpY3RNb2RlIl0sIm1hcHBpbmdzIjoiO0FBQUEsT0FBT0EsV0FBVyxRQUFRO0FBQzFCLE9BQU9DLGNBQWMsbUJBQW1CO0FBQ3hDLE9BQU9DLFNBQVMsUUFBUTtBQUN4QixTQUFTQyxhQUFhLEVBQUVDLFdBQVcsUUFBUSx1QkFBdUI7QUFDbEUsT0FBT0MsaUJBQWlCLDRCQUE0QjtBQUVwRCxzQ0FBc0M7QUFDdEMsTUFBTUMsUUFBUUYsWUFBWTtJQUN4QkcsU0FBUztRQUNQQyxNQUFNO1FBQ05DLFNBQVM7WUFDUEMsTUFBTTtZQUNOQyxPQUFPO1lBQ1BDLE1BQU07WUFDTkMsY0FBYztRQUNoQjtRQUNBQyxXQUFXO1lBQ1RKLE1BQU07WUFDTkMsT0FBTztZQUNQQyxNQUFNO1lBQ05DLGNBQWM7UUFDaEI7UUFDQUUsWUFBWTtZQUNWQyxTQUFTO1lBQ1RDLE9BQU87UUFDVDtRQUNBQyxNQUFNO1lBQ0pULFNBQVM7WUFDVEssV0FBVztZQUNYSyxVQUFVO1FBQ1o7UUFDQUMsU0FBUztJQUNYO0lBQ0FDLFlBQVk7UUFDVkMsWUFBWTtRQUNaQyxJQUFJO1lBQUVELFlBQVk7WUFBbUNFLFlBQVk7UUFBSTtRQUNyRUMsSUFBSTtZQUFFSCxZQUFZO1lBQW1DRSxZQUFZO1FBQUk7UUFDckVFLElBQUk7WUFBRUosWUFBWTtZQUFtQ0UsWUFBWTtRQUFJO1FBQ3JFRyxJQUFJO1lBQUVMLFlBQVk7WUFBbUNFLFlBQVk7UUFBSTtRQUNyRUksSUFBSTtZQUFFTixZQUFZO1lBQW1DRSxZQUFZO1FBQUk7UUFDckVLLElBQUk7WUFBRVAsWUFBWTtZQUFtQ0UsWUFBWTtRQUFJO1FBQ3JFTSxXQUFXO1lBQUVOLFlBQVk7UUFBSTtRQUM3Qk8sV0FBVztZQUFFUCxZQUFZO1FBQUk7UUFDN0JRLFFBQVE7WUFDTlYsWUFBWTtZQUNaVyxlQUFlO1lBQ2ZULFlBQVk7UUFDZDtJQUNGO0lBQ0FVLE9BQU87UUFDTEMsY0FBYztJQUNoQjtJQUNBQyxZQUFZO1FBQ1ZDLGdCQUFnQjtZQUNkQyxnQkFBZ0IsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztNQW1CakIsQ0FBQztRQUNIO1FBQ0FDLFdBQVc7WUFDVEQsZ0JBQWdCO2dCQUNkRSxNQUFNO29CQUNKTCxjQUFjO29CQUNkTSxTQUFTO29CQUNUQyxZQUFZO29CQUNaQyxXQUFXO29CQUNYLFdBQVc7d0JBQ1RBLFdBQVc7d0JBQ1hDLFdBQVc7b0JBQ2I7b0JBQ0EsWUFBWTt3QkFDVkEsV0FBVztvQkFDYjtnQkFDRjtnQkFDQUMsb0JBQW9CO29CQUNsQixXQUFXO3dCQUNURixXQUFXO29CQUNiO2dCQUNGO1lBQ0Y7UUFDRjtRQUNBRyxVQUFVO1lBQ1JSLGdCQUFnQjtnQkFDZEUsTUFBTTtvQkFDSk8saUJBQWlCO29CQUNqQkMsUUFBUTtnQkFDVjtZQUNGO1FBQ0Y7UUFDQUMsa0JBQWtCO1lBQ2hCWCxnQkFBZ0I7Z0JBQ2RFLE1BQU07b0JBQ0pFLFlBQVk7b0JBQ1osc0NBQXNDO3dCQUNwQ1EsYUFBYTtvQkFDZjtvQkFDQSw0Q0FBNEM7d0JBQzFDQSxhQUFhO29CQUNmO29CQUNBLGtEQUFrRDt3QkFDaERBLGFBQWE7b0JBQ2Y7Z0JBQ0Y7WUFDRjtRQUNGO0lBQ0Y7QUFDRjtBQUVBakQsU0FBU2tELFVBQVUsQ0FBQ0MsU0FBU0MsY0FBYyxDQUFDLFNBQVVDLE1BQU0sZUFDMUQsUUFBQ3RELE1BQU11RCxVQUFVO2NBQ2YsY0FBQSxRQUFDcEQ7UUFBY0csT0FBT0E7OzBCQUNwQixRQUFDRDs7Ozs7MEJBQ0QsUUFBQ0gifQ==