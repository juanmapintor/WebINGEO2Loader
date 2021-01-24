
const checkLog = () => {
    httpRequestPromise('http://localhost/WebINGEO2Loader/php/login_state.php', null, 'POST', 'json').then((response) => {
        if(!response.success || !response.is_admin) {
            alert("No ha iniciado sesion o su sesion ha caducado.");
            logOut();
        } else {
            document.querySelector('html').setAttribute('style', 'display: flex;');
            document.querySelector('body').setAttribute('style', 'display: flex;');
        }
    });
};

window.onload = () => {
    checkLog();
    configureTabs();
};

const configureTabs = () =>{
    const selectTab = (tabs, tabNum) => {
        let tabContents = document.querySelectorAll('.tabContent');
        tabs.forEach(tab => {
            tab.classList.remove('selected');
        });
        tabContents.forEach(tabContent => {
            tabContent.classList.remove('selected');
        });

        tabs[tabNum].classList.add('selected');
        tabContents[tabNum].classList.add('selected');
    };
    let tabs = document.querySelectorAll('.tab');
    for(let i = 0; i < tabs.length; i++){
        tabs[i].onclick = () => {
            selectTab(tabs, i);
        };
    }
}; 

