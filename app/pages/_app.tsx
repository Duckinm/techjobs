import {
  AppProps,
  ErrorComponent,
  useRouter,
  ErrorFallbackProps,
  CSRFTokenMismatchError,
} from "blitz"
import { ErrorBoundary } from "react-error-boundary"
import { queryCache } from "react-query"
import "react-bulma-components/dist/react-bulma-components.min.css"
import "../global.css"
import ErrorRedirectHome from "app/core/components/ErrorRedirectHome"

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)
  const router = useRouter()

  return (
    <ErrorBoundary
      FallbackComponent={RootErrorFallback}
      resetKeys={[router.asPath]}
      onReset={() => {
        // This ensures the Blitz useQuery hooks will automatically refetch
        // data any time you reset the error boundary
        queryCache.resetErrorBoundaries()
      }}
    >
      {getLayout(<Component {...pageProps} />)}
    </ErrorBoundary>
  )
}

function RootErrorFallback({ error }: ErrorFallbackProps) {
  if (error instanceof CSRFTokenMismatchError) {
    return (
      <ErrorRedirectHome
        statusCode={error.statusCode || 400}
        title={`An ${error.message || error.name} was thrown. Try reloading the page`}
      />
    )
  }
  return (
    <ErrorComponent
      statusCode={error.statusCode || 400}
      title={`An ${error.message || error.name} was thrown. Try reloading the page`}
    />
  )
}
