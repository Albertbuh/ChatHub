import styles from './chat.module.css'

import { CiVideoOn, CiPhone, CiCircleInfo, CiImageOn, CiCamera, CiMicrophoneOn } from "react-icons/ci";
import { BsEmojiNeutral } from "react-icons/bs";

const Chat = () => {
    const avatarPath = './avatars/Hayasaka.jpg';

    return (
        <div className={styles.chat}>
            <div className={styles.top}>
                <div className={styles.user}>
                    <img className={styles.avatarImg} src={avatarPath} alt='' />
                    <div className={styles.texts}>
                        <span className={styles.span}> Hayasaka Ai</span>
                        <p className={styles.p}> She is just the best girl
                            {/* Despite being the "big sister" to Kaguya and one of the most level-headed people in the whole cast, she still has a soft, sensitive, and inexperienced side to her. I don't know how far you've read or what examples I can give without spoilers. I can reply with spoilers if you want specifics.
                            She lives a fascinating double life as a high school student yet also the top maid/personal servant of a naive rich girl. Several months ago I made a post where I described every character (with exceptions as people noted) in one sentence: for Haysasaka I wrote " It's like if Alfred Pennysworth was really Batman, and Bruce Wayne was actually a moody teenage girl with bad, not-dead parents."
                            Going off the above point, she's somewhat of a cipher: given how difficult it is to separate her real personality from her endless wardrobe of disguises and "personas", Hayasaka can essentially be anything you want. Do you think that Hayasaka is an innocent girl who just acts tough on the job? Do you believe she's a cynical stick-in-the-mud? Do you think she's sweet and kind but too tired and busy to show it? Do you think she's a naive romantic who hides her insecurity beneath toughness? You can create many different interpretations for her and find moments to support your preferred "version" of her.
                            She's smart and hardworking, without putting her intelligence into mindgames or overthinking things like Shirogane and Kaguya do.
                            She is mostly above everyone else's nonsense. She cuts through the BS rather than creating more of it.
                            Unlike Chika, she hasn't been flanderized and memed into supervillainy/ultimate waifu material (depending on your view). Hayasaka isn't totally left out of the memes and iconic moments (HEY HEY HEY and "Hayasaka lied as easily as she breathed." are my favorites), but she can mostly stand on her own as a character.
                            She suffers inconvenience and frustration from other people, setting off some people's sense of "I must protecc". She suffers the kind of pain you can sympathize with, but doesn't make you pity or coddle her. She just wants a break!
                             */}
                        </p>
                    </div>
                </div>
                <div className={styles.icons}>
                    <CiPhone className={styles.imgI} />
                    <CiVideoOn className={styles.imgI} />
                    <CiCircleInfo className={styles.imgI} />
                </div>
            </div>


            <div className={styles.center}>
                <div className={styles.message}>
                    <img className={styles.avatarImg} src={avatarPath} alt='' />
                    <div className={styles.texts}>
                        <p className={styles.p}> Some text from cutie</p>
                        <span className={styles.span}>few seconds ago</span>
                    </div>
                </div>
                <div className={`${styles.message} ${styles.messageOwn}`}>
                    <div className={styles.texts}>
                        <p className={styles.p}> My Answer My Answer My Answer My Answer</p>
                        <span className={styles.span}>few seconds ago</span>
                    </div>
                </div>
                <div className={styles.message}>
                    <img className={styles.avatarImg} src={avatarPath} alt='' />
                    <div className={styles.texts}>
                        <p className={styles.p}> Some text from cutie</p>
                        <span className={styles.span}>few seconds ago</span>
                    </div>
                </div>
                <div className={`${styles.message} ${styles.messageOwn}`}>
                    <div className={styles.texts}>
                        <p className={styles.p}> My Answer My Answer My Answer My Answer My Answer My Answer</p>
                        <span className={styles.span}>few seconds ago</span>
                    </div>
                </div>
                <div className={styles.message}>
                    <img className={styles.avatarImg} src={avatarPath} alt='' />
                    <div className={styles.texts}>
                        <img className={styles.img} src='https://a.storyblok.com/f/178900/1920x1080/37ae90580e/4ca025356f824c76c2c3132631be82d81640322663_main.jpg/m/filters:quality(95)format(webp)'></img>
                        <p className={styles.p}> Some text from cutie</p>
                        <span className={styles.span}>few seconds ago</span>
                    </div>
                </div>
                <div className={`${styles.message} ${styles.messageOwn}`}>
                    <div className={styles.texts}>
                        <p className={styles.p}> My AnswerMy AnswerMy AnswerMy AnswerMy AnswerMy AnswerMy AnswerMy AnswerMy AnswerMy AnswerMy Answer</p>
                        <span className={styles.span}>few seconds ago</span>
                    </div>
                </div>
            </div>


            <div className={styles.bottom}>
                <div className={styles.icons}>
                    <CiImageOn className={styles.imgI} />
                    <CiCamera className={styles.imgI} />
                    <CiMicrophoneOn className={styles.imgI} />

                </div>
                <input className={styles.input} type='text'
                    placeholder='Type a message...'
                />
                <div className={styles.emoji}>
                    <BsEmojiNeutral className={styles.imgI} />
                </div>
                <button className={styles.sendButton}>Send</button>
            </div>
        </div>
    )
}

export default Chat