import { UserProfile } from '@clerk/clerk-react'

const MyAccount = () => {
    return (
        <div className='w-full h-[90vh] flex justify-center items-center'>
            <UserProfile
                appearance={{
                    elements: {
                        rootBox: "w-full h-full",
                        card: "w-full h-full shadow-none",
                        navbar: "h-full",
                        scrollBox: "w-full h-full ml-4",
                    }
                }}
            />
        </div>
    )
}

export default MyAccount