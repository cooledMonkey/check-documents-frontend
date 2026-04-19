const AppRoute = {
    Main: "/",
    Login: "/login",
    History: "/history",
    Registration: "/registration",
    ChangePassword: "/change-password"
} as const
const FileStatus = {
    Valid: "valid",
    Invalid: "invalid-sign",
    IncorrectFile: "invalid-file"
}
const FileStatusLabel: Record<FileStatusType, string> = {
  [FileStatus.Valid]: 'подпись действительна',
  [FileStatus.Invalid]: 'подпись недействительна',
  [FileStatus.IncorrectFile]: 'некорректный файл',
};

export type FileStatusType = typeof FileStatus[keyof typeof FileStatus];

export{AppRoute, FileStatus, FileStatusLabel}