import React from 'react';
import styles from '../../css/footer.module.css';

export default function Footer() {
    return (
        <div className={styles.container}>
            <span>
                Power by <a href="https://zh-hans.reactjs.org/" target="_blank">React</a> & <a
                href="https://nextjs.org/" target="_blank">Next.js</a><br/>
            </span>
            <p>
                <a href="https://github.com/sbx0" target="_blank">github</a>
                &nbsp;&nbsp;-&nbsp;&nbsp;
                <a href="https://dash.cloudflare.com/login" target="_blank">cloudflare</a>
                &nbsp;&nbsp;-&nbsp;&nbsp;
                <a href="http://mvn.coderead.cn/" target="_blank">maven</a>
                &nbsp;&nbsp;-&nbsp;&nbsp;
                <a href="https://www.npmjs.com/" target="_blank">npm</a>
                &nbsp;&nbsp;-&nbsp;&nbsp;
                <a href="https://ziyuan.baidu.com/site/index#/" target="_blank">baidu</a>
            </p>
            <script defer src='https://static.cloudflareinsights.com/beacon.min.js'
                    data-cf-beacon='{"token": "2d9d5be43b34404abb5064a088d50b68"}'/>
        </div>
    );
}
