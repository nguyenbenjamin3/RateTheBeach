//****Tried this but did not work, don't delete for now******
// import {useState, createContext} from 'react';
// import {getAuth, auth} from '../firebase';

// export const AuthContext = createContext('');
// export const auth2 = getAuth();

// export const AuthProvider = ({children}) => {
//     const [user, setUser] = useState(null);

//     return (
//         <AuthContext.Provider
//             value={{
//                 user,
//                 setUser,
//                 login: async (email, password) => {
//                     try {
//                      auth().signInWithEmailAndPassWord(email, password);
//                     } catch(e) {
//                         console.log(e);
//                     }
//                 },
//                 register: async (email, password) => {
//                     try {
//                         await auth().createUserWithEmailAndPassword(email, password);
//                     } catch(e) {
//                         console.log(e);
//                     }
//                 },
//                 logout: async () => {
//                     try {
//                         await auth().signOut();
//                     } catch(e) {
//                         console.log(e);
//                     }
//                 },
//             }}>
//             {children}
//         </AuthContext.Provider>
//     );
// }