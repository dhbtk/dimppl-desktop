import { RootRoute, Route, Router } from '@tanstack/react-router'
import { RootRouteComponent } from './routes/RootRouteComponent.tsx'
import { OnboardingUserAccountRoute } from './routes/onboarding/OnboardingUserAccountRoute.tsx'
import { OnboardingDeviceNameRoute } from './routes/onboarding/OnboardingDeviceNameRoute.tsx'
import { AppRoute } from './routes/app/AppRoute.tsx'
import { HomeRoute } from './routes/app/home/HomeRoute.tsx'
import { PodcastRoute } from './routes/app/podcast/PodcastRoute.tsx'
import { podcastApi } from './backend/podcastApi.ts'

export const rootRoute = new RootRoute({
  component: RootRouteComponent
})

export const onboardingUserAccountRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/onboarding/user_account',
  component: OnboardingUserAccountRoute
})
export const onboardingDeviceNameRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/onboarding/device_name',
  component: OnboardingDeviceNameRoute
})
export const appRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/app',
  component: AppRoute
})

export const appHomeRoute = new Route({
  getParentRoute: () => appRoute,
  path: '/',
  component: HomeRoute
})

export const podcastRoute = new Route({
  getParentRoute: () => appRoute,
  path: 'podcast/$podcastId',
  component: PodcastRoute,
  loader: async (params) => {
    const id = parseInt(params.params.podcastId, 10)
    const podcasts = await podcastApi.listAll()
    const podcast = podcasts.find(it => it.id === id)
    if (podcast !== undefined) {
      return podcast
    }
    throw new Error('podcast not found')
  }
})

const routeTree = rootRoute.addChildren([
  onboardingUserAccountRoute,
  onboardingDeviceNameRoute,
  appRoute.addChildren([appHomeRoute, podcastRoute])
])

export const router = new Router({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}