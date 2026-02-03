const ui = {
  'es-ES': "Español",
  'en-US': "English"
};

const defaultLang = 'en-US';

function getLang( url ) {
  if ( !url ) return defaultLang;
  const urlObj = new URL( url );
  const [ , lang ] = urlObj.pathname.split( '/' ).slice( 0, 2 );
  if ( lang in ui ) return lang;
  return defaultLang;
}

const handlerClasses = ( els, classe, action ) => {
  if ( !els || !classe ) return false;

  els.forEach( ( el ) => {
    el.classList[ action ]( classe );
  } );
}

// Handler Bg Header
function handlerBgHeader() {
  const header = document.querySelector( "header" );

  if ( !header ) return false;


  if ( window.scrollY > 50 ) {
    header.classList.remove( "top" );
  } else {
    header.classList.add( "top" );
  }
}

// Hadler pikcker lang

function handlerPickerLang() {
  const pickers = document.querySelectorAll( '#langSelector' );

  if ( !pickers ) return false;

  pickers.forEach( picker => {

    const listItems = picker.querySelector( '#langsItems' );
    if ( !listItems ) return false;

    picker.addEventListener( 'click', () => {
      listItems.classList.toggle( 'show' );
    } )
  } );
}

function handlerModalWhatsapp() {
  const container = document.querySelector( '#whatsappWrapper .modal-bg' );
  const content = document.querySelector( '#whatsappWrapper .modal-content' );
  const btnClose = document.querySelector( '#whatsappWrapper .modal-header .close' );
  const btnOpen = document.querySelector( '#whatsappWrapper .btn-whatsapp-floating' );

  if ( !container || !content || !btnClose || !btnOpen ) return false;

  btnOpen.addEventListener( 'click', () => handlerClasses( [ container, content ], "show", "add" ) );
  btnClose.addEventListener( 'click', () => handlerClasses( [ container, content ], "show", "remove" ) );
}

function getItemsFormSearch() {
  const modalResult = document.querySelector( '#search-popup .modal-result' );
  const form = document.querySelector( '#search-popup form' );
  if ( !form || !modalResult ) return false;

  form?.addEventListener( 'submit', async ( e ) => {
    e.preventDefault();
    const formData = new FormData( form );
    const valueInput = formData.get( 'q' );
    const lang = getLang( window.location.href );


    const message = ( text ) => {
      return `<div class="no-items"><i class="fa-chisel fa-regular fa-magnifying-glass"></i><p>${ text }</p></div>`
    }

    try {
      const res = await fetch( `/api/search/v1/search?q=${ encodeURIComponent( valueInput ) }&lang=${ lang }` );
      const data = await res.json();

      modalResult.innerHTML = "";
      modalResult.classList.add( 'active' );

      if ( !data || data?.length <= 0 ) {
        modalResult.innerHTML = message( "No found items" );
        return;
      }

      if ( data.error ) {
        throw data.error ;
      }
      // Mapping data response
      data?.forEach( item => {
        item?.languages_code === lang && (
         modalResult.innerHTML += `
            <div class="result-item">
                <a href="/${ item.slug }">
                  ${ item.title }
                </a>
            </div>
          ` );
      } );

    } catch ( err ) {
      console.error( err );
      modalResult.innerHTML = message( err || "Error searching items" );
    }
  } )
}

window.addEventListener( "DOMContentLoaded", () => {
  handlerBgHeader();
  handlerPickerLang();
  handlerModalWhatsapp();
  getItemsFormSearch()

  // Set date input
  const inputsDate = document.querySelectorAll( 'input[type="date"]' );
  if ( inputsDate ) {
  }
  inputsDate.forEach( date => {
    date?.classList.add( 'empty' );
    date?.addEventListener( 'change', () => {
      date.classList.toggle( 'empty', !date?.value );
    } )
  } )
} );

window.addEventListener( "scroll", () => {
  handlerBgHeader();
} );