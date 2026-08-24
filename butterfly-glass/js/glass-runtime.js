/*
 * Butterfly Glass
 *
 * Glass Runtime
 *
 * Version:
 * v4.0.0
 *
 * Responsibilities:
 * - Browser capability detection
 * - Glass performance mode
 * - Reduced-motion handling
 * - Desktop pointer optical interaction
 * - CSS custom property synchronization
 *
 * This runtime does NOT render UI.
 * It only exposes runtime state to CSS.
 */

(() => {
    'use strict';


    /* =====================================
       Default Configuration
    ===================================== */

    const DEFAULT_CONFIG = {

        enabled: true,

        /*
         * Whether mobile devices should use
         * the full Glass effect.
         *
         * Default:
         * false
         *
         * Mobile therefore uses Reduced Glass.
         */
        mobileFullGlass: false,

        /*
         * Enable pointer-driven optical lighting
         * on devices with a fine pointer.
         */
        pointerOptical: true,

        /*
         * Performance mode:
         *
         * auto
         * full
         * reduced
         * fallback
         */
        reducedMode: 'auto'

    };


    /* =====================================
       Global Runtime State
    ===================================== */

    const state = {

        initialized: false,

        enabled: true,

        mode: 'fallback',

        isMobile: false,

        isTouch: false,

        hasFinePointer: false,

        supportsBackdrop: false,

        supportsColorMix: false,

        prefersReducedMotion: false,

        pointerOptical: false,

        pointerX: 0.5,

        pointerY: 0.5,

        rafPending: false

    };


    /* =====================================
       Configuration
    ===================================== */

    const userConfig =
        window.ButterflyGlassConfig || {};


    const config = {

        ...DEFAULT_CONFIG,

        ...userConfig

    };


    /* =====================================
       Utility
    ===================================== */

    function clamp(value, min, max) {

        return Math.min(
            Math.max(value, min),
            max
        );

    }


    function setRootProperty(name, value) {

        document.documentElement.style.setProperty(
            name,
            value
        );

    }


    function removeRootProperty(name) {

        document.documentElement.style.removeProperty(
            name
        );

    }


    /* =====================================
       Device Detection
    ===================================== */

    function detectDevice() {

        const mediaFinePointer =
            window.matchMedia(
                '(pointer: fine)'
            );

        const mediaCoarsePointer =
            window.matchMedia(
                '(pointer: coarse)'
            );

        const mediaHover =
            window.matchMedia(
                '(hover: hover)'
            );


        state.hasFinePointer =
            mediaFinePointer.matches;


        state.isTouch =
            mediaCoarsePointer.matches;


        /*
         * We intentionally do not rely exclusively
         * on user-agent detection.
         *
         * Screen width + pointer capability gives
         * a more useful result for Glass rendering.
         */
        state.isMobile =
            window.matchMedia(
                '(max-width: 768px)'
            ).matches;


        /*
         * A fine pointer + hover capability is
         * required for pointer optical interaction.
         */
        state.pointerOptical =
            Boolean(
                config.pointerOptical &&
                state.hasFinePointer &&
                mediaHover.matches
            );

    }


    /* =====================================
       Browser Capability Detection
    ===================================== */

    function detectCapabilities() {

        state.supportsBackdrop =
            CSS.supports(
                'backdrop-filter',
                'blur(1px)'
            ) ||
            CSS.supports(
                '-webkit-backdrop-filter',
                'blur(1px)'
            );


        state.supportsColorMix =
            CSS.supports(
                'color',
                'color-mix(in srgb, red, blue)'
            );

    }


    /* =====================================
       Accessibility Detection
    ===================================== */

    function detectMotionPreference() {

        const media =
            window.matchMedia(
                '(prefers-reduced-motion: reduce)'
            );


        state.prefersReducedMotion =
            media.matches;

    }


    /* =====================================
       Runtime Mode
    ===================================== */

    function resolveMode() {

        /*
         * Global disable.
         */
        if (!config.enabled) {

            state.enabled = false;

            state.mode = 'fallback';

            return;
        }


        state.enabled = true;


        /*
         * Explicit mode selection.
         */
        if (
            config.reducedMode === 'full'
        ) {

            state.mode =
                state.supportsBackdrop
                    ? 'full'
                    : 'fallback';

            return;
        }


        if (
            config.reducedMode === 'reduced'
        ) {

            state.mode =
                state.supportsBackdrop
                    ? 'reduced'
                    : 'fallback';

            return;
        }


        if (
            config.reducedMode === 'fallback'
        ) {

            state.mode = 'fallback';

            return;
        }


        /*
         * Automatic mode.
         */

        if (!state.supportsBackdrop) {

            state.mode = 'fallback';

            return;
        }


        /*
         * Accessibility takes priority.
         */
        if (state.prefersReducedMotion) {

            state.mode = 'reduced';

            return;
        }


        /*
         * Mobile devices use Reduced Glass by default.
         */
        if (
            state.isMobile &&
            !config.mobileFullGlass
        ) {

            state.mode = 'reduced';

            return;
        }


        /*
         * Desktop / capable devices.
         */
        state.mode = 'full';

    }


    /* =====================================
       Root Classes
    ===================================== */

    function updateRootClasses() {

        const root =
            document.documentElement;


        root.classList.remove(
            'glass-runtime', 'glass-full', 'glass-reduced', 'glass-fallback',
            'glass-mobile', 'glass-desktop', 'glass-touch', 'glass-pointer',
            'glass-reduced-motion', 'lg-full', 'lg-reduced', 'lg-fallback',
            'lg-mobile', 'lg-mobile-full', 'lg-desktop', 'lg-touch', 'lg-pointer',
            'lg-reduced-motion', 'lg-disabled'
        );


        root.classList.add(
            'glass-runtime'
        );


        root.classList.add(
            `glass-${state.mode}`
        );

        root.classList.add(`lg-${state.mode}`);

        if (!state.enabled) {
            root.classList.add('lg-disabled');
        }


        if (state.isMobile) {

            root.classList.add(
                'glass-mobile'
            );
            root.classList.add('lg-mobile');

            if (config.mobileFullGlass) {
                root.classList.add('lg-mobile-full');
            }

        } else {

            root.classList.add(
                'glass-desktop'
            );
            root.classList.add('lg-desktop');

        }


        if (state.isTouch) {

            root.classList.add(
                'glass-touch'
            );
            root.classList.add('lg-touch');

        }


        if (state.pointerOptical) {

            root.classList.add(
                'glass-pointer'
            );
            root.classList.add('lg-pointer');

        }


        if (
            state.prefersReducedMotion
        ) {

            root.classList.add(
                'glass-reduced-motion'
            );
            root.classList.add('lg-reduced-motion');

        }

    }


    /* =====================================
       Runtime CSS Variables
    ===================================== */

    function updateRuntimeVariables() {

        /*
         * Runtime mode.
         */
        setRootProperty(
            '--lg-runtime-mode',
            `"${state.mode}"`
        );


        /*
         * Capability flags.
         *
         * These are mainly useful for CSS
         * selectors / future extensions.
         */
        setRootProperty(
            '--lg-supports-backdrop',
            state.supportsBackdrop
                ? '1'
                : '0'
        );


        setRootProperty(
            '--lg-supports-color-mix',
            state.supportsColorMix
                ? '1'
                : '0'
        );


        /*
         * Device state.
         */
        setRootProperty(
            '--lg-mobile',
            state.isMobile
                ? '1'
                : '0'
        );


        setRootProperty(
            '--lg-touch',
            state.isTouch
                ? '1'
                : '0'
        );


        /*
         * Pointer optical state.
         */
        setRootProperty(
            '--lg-pointer-optical',
            state.pointerOptical
                ? '1'
                : '0'
        );


        /*
         * Default pointer position.
         */
        setRootProperty(
            '--lg-optical-x',
            '50%'
        );


        setRootProperty(
            '--lg-optical-y',
            '50%'
        );


        /*
         * Optical intensity.
         *
         * Full:
         * 1
         *
         * Reduced:
         * 0.55
         *
         * Fallback:
         * 0
         */
        let opticalStrength = 0;


        if (state.mode === 'full') {

            opticalStrength = 1;

        } else if (
            state.mode === 'reduced'
        ) {

            opticalStrength = 0.55;

        }


        setRootProperty(
            '--lg-runtime-optical-strength',
            String(opticalStrength)
        );


        /*
         * Interaction strength.
         */
        const interactionStrength =
            state.pointerOptical
                ? opticalStrength
                : 0;


        setRootProperty(
            '--lg-runtime-interaction-strength',
            String(interactionStrength)
        );

    }


    /* =====================================
       Pointer Optical
    ===================================== */

    function updatePointer(
        clientX,
        clientY
    ) {

        if (
            !state.pointerOptical ||
            state.mode === 'fallback'
        ) {

            return;
        }


        const width =
            window.innerWidth || 1;


        const height =
            window.innerHeight || 1;


        const x =
            clamp(
                clientX / width,
                0,
                1
            );


        const y =
            clamp(
                clientY / height,
                0,
                1
            );


        state.pointerX = x;

        state.pointerY = y;


        /*
         * Avoid updating CSS variables
         * multiple times in the same frame.
         */
        if (state.rafPending) {

            return;
        }


        state.rafPending = true;


        window.requestAnimationFrame(() => {

            state.rafPending = false;


            setRootProperty(
                '--lg-optical-x',
                `${x * 100}%`
            );


            setRootProperty(
                '--lg-optical-y',
                `${y * 100}%`
            );

        });

    }


    function resetPointer() {

        if (
            !state.pointerOptical
        ) {

            return;
        }


        setRootProperty(
            '--lg-optical-x',
            '50%'
        );


        setRootProperty(
            '--lg-optical-y',
            '50%'
        );

    }


    function setupPointerEvents() {

        if (
            !state.pointerOptical
        ) {

            return;
        }


        document.addEventListener(
            'pointermove',
            event => {

                updatePointer(
                    event.clientX,
                    event.clientY
                );

            },
            {
                passive: true
            }
        );


        document.addEventListener(
            'pointerleave',
            resetPointer,
            {
                passive: true
            }
        );


        window.addEventListener(
            'blur',
            resetPointer,
            {
                passive: true
            }
        );

    }


    /* =====================================
       Resize Handling
    ===================================== */

    function handleResize() {

        detectDevice();

        resolveMode();

        updateRootClasses();

        updateRuntimeVariables();

    }


    function setupResizeObserver() {

        let timeout = null;


        window.addEventListener(
            'resize',
            () => {

                clearTimeout(timeout);


                timeout = setTimeout(
                    handleResize,
                    150
                );

            },
            {
                passive: true
            }
        );

    }


    /* =====================================
       Motion Preference Changes
    ===================================== */

    function setupMotionObserver() {

        const media =
            window.matchMedia(
                '(prefers-reduced-motion: reduce)'
            );


        const handler = () => {

            state.prefersReducedMotion =
                media.matches;


            resolveMode();

            updateRootClasses();

            updateRuntimeVariables();

        };


        if (
            typeof media.addEventListener ===
            'function'
        ) {

            media.addEventListener(
                'change',
                handler
            );

        } else {

            /*
             * Compatibility for older browsers.
             */
            media.addListener(
                handler
            );

        }

    }


    /* =====================================
       Public API
    ===================================== */

    function exposeAPI() {

        window.ButterflyGlass =
            {

                /*
                 * Read-only state snapshot.
                 */
                getState() {

                    return {
                        ...state
                    };

                },


                /*
                 * Force runtime mode.
                 *
                 * Supported:
                 * full
                 * reduced
                 * fallback
                 * auto
                 */
                setMode(mode) {

                    if (
                        ![
                            'full',
                            'reduced',
                            'fallback',
                            'auto'
                        ].includes(mode)
                    ) {

                        return;

                    }


                    config.reducedMode =
                        mode;


                    resolveMode();

                    updateRootClasses();

                    updateRuntimeVariables();

                },


                /*
                 * Enable / disable Glass.
                 */
                setEnabled(enabled) {

                    config.enabled =
                        Boolean(enabled);


                    resolveMode();

                    updateRootClasses();

                    updateRuntimeVariables();

                },


                /*
                 * Re-run capability detection.
                 */
                refresh() {

                    detectDevice();

                    detectCapabilities();

                    detectMotionPreference();

                    resolveMode();

                    updateRootClasses();

                    updateRuntimeVariables();

                }

            };

    }


    /* =====================================
       Initialization
    ===================================== */

    function initialize() {

        if (
            state.initialized
        ) {

            return;
        }


        /*
         * DOM must be available before
         * touching documentElement.
         */
        if (
            document.readyState ===
            'loading'
        ) {

            document.addEventListener(
                'DOMContentLoaded',
                initialize,
                {
                    once: true
                }
            );

            return;
        }


        detectDevice();

        detectCapabilities();

        detectMotionPreference();

        resolveMode();

        updateRootClasses();

        updateRuntimeVariables();

        setupPointerEvents();

        setupResizeObserver();

        setupMotionObserver();

        exposeAPI();


        state.initialized = true;


        /*
         * Useful for debugging without
         * producing console noise in production.
         */
        if (
            config.debug === true
        ) {

            console.info(
                '[Butterfly Glass]',
                {
                    mode: state.mode,
                    mobile: state.isMobile,
                    touch: state.isTouch,
                    backdrop: state.supportsBackdrop,
                    colorMix: state.supportsColorMix,
                    pointerOptical:
                        state.pointerOptical,
                    reducedMotion:
                        state.prefersReducedMotion
                }
            );

        }

    }


    /* =====================================
       Start
    ===================================== */

    initialize();


})();
