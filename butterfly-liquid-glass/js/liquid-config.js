/*
 * Butterfly Liquid Glass
 *
 * Configuration Bridge
 *
 * v2.0
 *
 */


(function(){


    const CONFIG_URL =
    '/butterfly-liquid-glass/liquid-state.json';



    fetch(CONFIG_URL)


    .then(res => res.json())


    .then(config => {



        const body =
        document.body;



        /*
         Global
        */


        if(!config.enable){


            body.classList.add(
                'liquid-disabled'
            );


        }



        /*
         Article
        */


        if(!config.article_card){


            body.classList.add(
                'liquid-article-disabled'
            );


        }



        /*
         Sidebar
        */


        if(!config.sidebar){


            body.classList.add(
                'liquid-sidebar-disabled'
            );


        }



        /*
         Floating Button
        */


        if(!config.floating_button){


            body.classList.add(
                'liquid-button-disabled'
            );


        }



        /*
         Background
        */


        if(!config.background){


            body.classList.add(
                'liquid-background-disabled'
            );


        }



        /*
         Animation
        */


        if(!config.animation){


            body.classList.add(
                'liquid-animation-disabled'
            );


        }



    })



    .catch(err => {


        console.warn(

            '[Liquid Glass] Config load failed',

            err

        );


    });



})();