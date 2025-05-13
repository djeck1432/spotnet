# Getting Started with Vite

This project was migrated from [Create React App](https://github.com/facebook/create-react-app) to [Vite](https://vitejs.dev/), a fast and modern frontend build tool.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in development mode.  
Open [http://localhost:5173](http://localhost:5173) (default) to view it in your browser.

The page will reload when you make changes.  
You may also see any errors or warnings in the console.

### `yarn test`

Runs the tests using the environment provisioned by Vitest. After running the initial setup and starting the app, open another terminal shell, navigate to the frontend directory, and run `yarn test`.

### `yarn build`

Builds the app for production to the `dist` folder.  
It optimizes the build for the best performance using Vite's efficient bundling and minification process.

The production build is ready to be deployed!

For more information on deployment, check out [Vite's deployment guide](https://vitejs.dev/guide/static-deploy.html).

## Learn More

To learn more about Vite, visit the [Vite documentation](https://vitejs.dev/guide/).

To learn React, check out the [React documentation](https://react.dev/).

## Code Splitting and Performance

Vite supports efficient code splitting and performance optimization out of the box. Learn more in [Vite's guide to optimization](https://vitejs.dev/guide/features.html#code-splitting).

## Troubleshooting

If you encounter any issues during development or deployment, refer to the [Vite Troubleshooting Guide](https://vitejs.dev/guide/troubleshooting.html).

## Migration Notes

### Key Changes from Create React App:

- The development server now runs on [Vite](https://vitejs.dev/), offering faster startup and rebuild times.
- `yarn dev` replaces `yarn start` for running the development server.
- Production builds are now output to the `dist` folder instead of the `build` folder.
- Vite uses [ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) by default, ensuring modern, fast builds.
- Configuration has been simplified with a `vite.config.js` or `vite.config.ts` file.

For help with the migration process, check out [Vite's guide for migrating from CRA](https://vitejs.dev/guide/migration-from-cra.html).
