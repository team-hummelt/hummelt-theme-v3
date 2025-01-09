
let loginFormContainer = document.querySelector("#login");
if(loginFormContainer) {
    /*let fragment = document.createDocumentFragment();
    fragment.appendChild(document.querySelector('.message'));
    document.getElementById('login').prepend(fragment);*/
    let submit = document.querySelector("input#wp-submit");
    let wrapper = document.createElement('span');
    submit.parentNode.insertBefore(wrapper, submit);
    wrapper.appendChild(submit);
    wrapper.classList.add('btn-wrapper');
    let today = new Date();
    let year = today.getFullYear();
    let footer = `<div class="theme-login-footer">
    <div class="container">@${year} Powered by&nbsp; 
    <a href="https://www.hummelt-werbeagentur.de/" title="hummelt und partner | Werbeagentur GmbH">
     <b class="hupa-red">hummelt und partner</b> 
    </a>&nbsp;|&nbsp;Werbeagentur GmbH
    </div>
    </div>`;
    loginFormContainer.insertAdjacentHTML("afterend", footer);
}


