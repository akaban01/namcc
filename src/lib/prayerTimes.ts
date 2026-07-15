import { Coordinates, CalculationMethod, PrayerTimes as AdhanPrayerTimes, Madhab } from 'adhan';

export interface PrayerSettings {
	latitude: number;
	longitude: number;
	timezone: string;
	calculationMethod: keyof typeof CalculationMethod;
	madhab: 'Shafi' | 'Hanafi';
	adjustments?: Partial<Record<'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha', number>>;
	iqamah: {
		fajr: string;
		dhuhr: string;
		asr: string;
		maghribOffsetMinutes: number;
		isha: string;
	};
}

export interface PrayerRow {
	salaat: string;
	adhaan: string;
	iqamah: string;
}

export interface ComputedPrayerTimes {
	rows: PrayerRow[];
	gregorianLabel: string;
	hijriDate: string;
}

/** Today's calendar date in the given IANA timezone, pinned to noon to stay clear of any day-boundary/DST edge cases. */
function todayInTimezone(timezone: string): Date {
	const dateStr = new Intl.DateTimeFormat('en-CA', {
		timeZone: timezone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).format(new Date());
	return new Date(`${dateStr}T12:00:00`);
}

export function computeTodayPrayerTimes(settings: PrayerSettings, date = todayInTimezone(settings.timezone)): ComputedPrayerTimes {
	const coordinates = new Coordinates(settings.latitude, settings.longitude);
	const params = CalculationMethod[settings.calculationMethod]();
	params.madhab = Madhab[settings.madhab];
	if (settings.adjustments) {
		Object.assign(params.adjustments, settings.adjustments);
	}
	const pt = new AdhanPrayerTimes(coordinates, date, params);

	const timeFmt = new Intl.DateTimeFormat('en-US', {
		hour: 'numeric',
		minute: '2-digit',
		hour12: true,
		timeZone: settings.timezone,
	});

	const maghribIqamah = new Date(pt.maghrib.getTime() + settings.iqamah.maghribOffsetMinutes * 60_000);

	const rows: PrayerRow[] = [
		{ salaat: 'Fajr', adhaan: timeFmt.format(pt.fajr), iqamah: settings.iqamah.fajr },
		{ salaat: 'Sunrise', adhaan: timeFmt.format(pt.sunrise), iqamah: '.' },
		{ salaat: 'Dhuhr', adhaan: timeFmt.format(pt.dhuhr), iqamah: settings.iqamah.dhuhr },
		{ salaat: 'Asr', adhaan: timeFmt.format(pt.asr), iqamah: settings.iqamah.asr },
		{ salaat: 'Maghrib', adhaan: timeFmt.format(pt.maghrib), iqamah: timeFmt.format(maghribIqamah) },
		{ salaat: 'Isha', adhaan: timeFmt.format(pt.isha), iqamah: settings.iqamah.isha },
	];

	const gregorianLabel =
		new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', timeZone: settings.timezone }).format(date) + '.';

	const hijriDate = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
		day: 'numeric',
		month: 'long',
		timeZone: settings.timezone,
	}).format(date);

	return { rows, gregorianLabel, hijriDate };
}
