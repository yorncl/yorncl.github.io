import {GetStaticProps} from 'next';

const about = () => {
    return (
        <div>
            Welcome to the about page
        </div>
    );
}

export const getStaticProps:GetStaticProps = async (ctx) => {


    return {
        props:{
            data:null
        }
    }
}

export default about;