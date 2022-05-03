import './ErrorPage.css';

export default function ErrorPage() {

    return (
        <div>
            <h1 class='errh1'>404 Страница не найдена</h1>

            <section class="error-container">
                <span class="four"><span class="screen-reader-text">4</span></span>
                <span class="zero"><span class="screen-reader-text">0</span></span>
                <span class="four"><span class="screen-reader-text">4</span></span>
            </section>
            <div class="link-container">
                <a target="_blank" href="/" class="more-link">Вернутся на главную</a>
            </div>
        </div>

    )

}