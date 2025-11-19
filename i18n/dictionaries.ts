export enum LocaleEnum {
	En = "en",
	Nl = "nl",
}

export type Locale = LocaleEnum.En | LocaleEnum.Nl;
export type Dictionary = {
	[key: string]: string | Dictionary;
};
export const locales: Locale[] = Object.values(LocaleEnum) as Locale[];

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
	[LocaleEnum.En]: () =>
		import("./dictionaries/en.json").then(
			(module) => module.default as Dictionary
		),
	[LocaleEnum.Nl]: () =>
		import("./dictionaries/nl.json").then(
			(module) => module.default as Dictionary
		),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
	dictionaries[locale]();
