const AppRoute = {
    Main: "/",
    Login: "/login",
    History: "/history",
    Registration: "/registration"
} as const
const FileStatus = {
    Valid: "valid",
    Invalid: "invalid-sign",
    IncorrectFile: "invalid-file"
}
const FileStatusLabel = {
    Valid: "подпись действительна",
    Invalid: "подпись недействительна",
    IncorrectFile: "некорректный файл"
}
export{AppRoute, FileStatus, FileStatusLabel}