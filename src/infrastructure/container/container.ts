import { Container } from 'inversify';
import { repositoryBindings } from './bindings/repository.bindings';
import { serviceBindings } from './bindings/service.bindings';
import { useCaseBindings } from './bindings/use-case.bindings';
import { controllerBindings } from './bindings/controller.bindings';

/**
 * Main Dependency Injection Container
 * This is where all dependencies are configured and bound
 */
class DIContainer {
    private static instance: Container;

    /**
     * Get the singleton container instance
     */
    public static getInstance(): Container {
        if (!DIContainer.instance) {
            DIContainer.instance = new Container({
                defaultScope: 'Singleton'
            });

            DIContainer.loadBindings();
        }

        return DIContainer.instance;
    }

    /**
     * Load all binding modules
     */
    private static loadBindings(): void {
        DIContainer.instance.load(
            repositoryBindings,
            serviceBindings,
            useCaseBindings,
            controllerBindings
        );
    }

    /**
     * Create a new container instance for testing
     */
    public static createTestContainer(): Container {
        const testContainer = new Container({
            defaultScope: 'Singleton'
        });

        // Load only test-specific bindings
        testContainer.load(
            serviceBindings,
            useCaseBindings
        );

        return testContainer;
    }

    /**
     * Reset the container (useful for testing)
     */
    public static reset(): void {
        if (DIContainer.instance) {
            DIContainer.instance.unbindAll();
            DIContainer.loadBindings();
        }
    }
}

// Export the singleton container instance
export const container = DIContainer.getInstance();
export { DIContainer };
