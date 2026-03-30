export interface Language {
	code: string;
	name: string;
	flag: string;
}

export async function getLanguages(): Promise<Language[]> {
	try {
		const response = await fetch('https://restcountries.com/v3.1/all?fields=cca2,name,flag');
		if (!response.ok) throw new Error('Failed to fetch countries');

		const countries = await response.json();

		const uniqueLanguages = new Map<string, Language>();

		for (const country of countries) {
			const langs = country.languages || {};

			for (const [code, name] of Object.entries(langs)) {
				const langCode = code.toLowerCase();
				if (!uniqueLanguages.has(langCode)) {
					uniqueLanguages.set(langCode, {
						code: langCode,
						name: name as string,
						flag: country.flag
					});
				}
			}
		}

		return Array.from(uniqueLanguages.values()).sort((a, b) => a.name.localeCompare(b.name));
	} catch (error) {
		console.error('Failed to fetch languages:', error);
		return [];
	}
}

export const COMMON_LANGUAGES: Language[] = [
	{ code: 'en', name: 'English', flag: '🇬🇧' },
	{ code: 'es', name: 'Spanish', flag: '🇪🇸' },
	{ code: 'fr', name: 'French', flag: '🇫🇷' },
	{ code: 'de', name: 'German', flag: '🇩🇪' },
	{ code: 'it', name: 'Italian', flag: '🇮🇹' },
	{ code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
	{ code: 'ru', name: 'Russian', flag: '🇷🇺' },
	{ code: 'zh', name: 'Chinese', flag: '🇨🇳' },
	{ code: 'ja', name: 'Japanese', flag: '🇯🇵' },
	{ code: 'ko', name: 'Korean', flag: '🇰🇷' },
	{ code: 'ar', name: 'Arabic', flag: '🇸🇦' },
	{ code: 'hi', name: 'Hindi', flag: '🇮🇳' },
	{ code: 'nl', name: 'Dutch', flag: '🇳🇱' },
	{ code: 'pl', name: 'Polish', flag: '🇵🇱' },
	{ code: 'tr', name: 'Turkish', flag: '🇹🇷' },
	{ code: 'vi', name: 'Vietnamese', flag: '🇻🇳' },
	{ code: 'th', name: 'Thai', flag: '🇹🇭' },
	{ code: 'sv', name: 'Swedish', flag: '🇸🇪' },
	{ code: 'da', name: 'Danish', flag: '🇩🇰' },
	{ code: 'no', name: 'Norwegian', flag: '🇳🇴' },
	{ code: 'fi', name: 'Finnish', flag: '🇫🇮' },
	{ code: 'el', name: 'Greek', flag: '🇬🇷' },
	{ code: 'he', name: 'Hebrew', flag: '🇮🇱' },
	{ code: 'uk', name: 'Ukrainian', flag: '🇺🇦' },
	{ code: 'cs', name: 'Czech', flag: '🇨🇿' },
	{ code: 'hu', name: 'Hungarian', flag: '🇭🇺' },
	{ code: 'ro', name: 'Romanian', flag: '🇷🇴' },
	{ code: 'id', name: 'Indonesian', flag: '🇮🇩' },
	{ code: 'ms', name: 'Malay', flag: '🇲🇾' },
	{ code: 'fa', name: 'Persian', flag: '🇮🇷' }
];
