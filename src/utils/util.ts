import { ChartDocument, SongDocument, Game, IDStrings, Playtypes } from "..";
import { GetGameConfig, GetGamePTConfig } from "../config/config";

export function FormatInt(v: number): string {
	return v.toString();
}

export function FormatDifficulty(chart: ChartDocument, game: Game): string {
	const gameConfig = GetGameConfig(game);

	if (gameConfig.validPlaytypes.length > 1) {
		return `${chart.playtype} ${chart.difficulty} ${chart.level}`;
	}

	return `${chart.difficulty} ${chart.level}`;
}

/**
 * Formats a chart's difficulty into a shorter variant. This handles a lot of
 * game-specific strange edge cases.
 */
export function FormatDifficultyShort(chart: ChartDocument, game: Game): string {
	const gameConfig = GetGameConfig(game);
	const gptConfig = GetGamePTConfig(game, chart.playtype);
	const shortDiff = gptConfig.shortDifficulties[chart.difficulty] ?? chart.difficulty;

	if (game === "ddr") {
		return `${shortDiff}${chart.playtype}`;
	}

	if (gameConfig.validPlaytypes.length === 1 || game === "gitadora") {
		return `${shortDiff} ${chart.level}`;
	}

	return `${chart.playtype}${shortDiff} ${chart.level}`;
}

export function FormatGame(game: Game, playtype: Playtypes[Game]): string {
	const gameConfig = GetGameConfig(game);

	if (gameConfig.validPlaytypes.length === 1) {
		return gameConfig.name;
	}

	return `${gameConfig.name} (${playtype})`;
}

export function FormatChart(
	game: Game,
	song: SongDocument,
	chart: ChartDocument<IDStrings>
): string {
	if (game === "bms") {
		return song.title;
	}

	const gameConfig = GetGameConfig(game);

	let playtypeStr = `${chart.playtype} `;

	if (gameConfig.validPlaytypes.length === 1) {
		playtypeStr = "";
	}

	// return the most recent version this chart appeared in if it
	// is not primary.
	if (!chart.isPrimary) {
		return `${song.title} (${playtypeStr}${chart.difficulty} ${chart.versions[0]})`;
	}

	return `${song.title} (${playtypeStr}${chart.difficulty})`;
}
