import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting, TFile } from 'obsidian';
import { CanvasNodeData, CanvasData, CanvasTextData  } from "obsidian/canvas";

// Remember to rename these classes and interfaces!

// interface TimelineCanvasPluginSettings {
// 	mySetting: string;
// }

const CanvasTimelineData: CanvasData = {
    nodes: [],
    edges: [],
};

// const DEFAULT_SETTINGS: TimelineCanvasPluginSettings = {
// 	mySetting: 'default'
// }

export default class TimelineCanvasPlugin extends Plugin {
	// settings: TimelineCanvasPluginSettings;

	async onload() {
		// await this.loadSettings();


		// This creates an icon in the left ribbon.
		// const ribbonIconEl = this.addRibbonIcon('dice', 'Sample Plugin', (evt: MouseEvent) => {
		// 	// Called when the user clicks the icon.
		// 	new Notice('This is a notice!');
		// });

		
		// // Perform additional things with the ribbon
		// ribbonIconEl.addClass('my-plugin-ribbon-class');

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		// const statusBarItemEl = this.addStatusBarItem();
		// statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'create-timeline-canvas',
			name: 'Create timeline Canvas',
			callback: () => {
				new CreateTimelineModal(this.app, (startYear: number, endYear: number, interval: number) => {
					//console.log ("Start Year:", startYear, "End Year:", endYear, "Interval:", interval);

					let x = 0;
					const y = 0;
					const spacing = 100; // Distance between nodes horizontally
					
					for (let year = startYear; year <= endYear; year += interval) {
						const node: CanvasNodeData = {
							id: crypto.randomUUID(), // Generates a unique ID for each node
							x: x,
							y: y,
							width: 100,
							height: 50,
							type: "text",
							text: year.toString(),
						};
						CanvasTimelineData.nodes.push(node as CanvasTextData);
						x += spacing; // Move next node to the right
					};

					const fileName = `New Canvas ${Date.now()}.canvas`;
					const filePath = fileName; // You can change the folder name

					// Create the canvas file
					this.app.vault.create(filePath, JSON.stringify(CanvasTimelineData, null, 2));

					// Open the new Canvas in a new tab
					// const file = this.app.vault.getAbstractFileByPath(filePath);
					// if (file && file instanceof TFile) {
					// 	this.app.workspace.getLeaf(true).openFile(file);
					// }

					const fileContent = JSON.stringify(CanvasTimelineData, null, 2);

					this.app.vault.create(filePath, fileContent).then((file) => {
						this.app.workspace.getLeaf(true).openFile(file);
					}).catch((error) => {
						console.error("Failed to create Canvas file:", error);
					});
				}).open();
			}
		});
		// This adds an editor command that can perform some operation on the current editor instance
		// this.addCommand({
		// 	id: 'sample-editor-command',
		// 	name: 'Sample editor command',
		// 	editorCallback: (editor: Editor, view: MarkdownView) => {
		// 		console.log(editor.getSelection());
		// 		editor.replaceSelection('Sample Editor Command');
		// 	}
		// });
		// This adds a complex command that can check whether the current state of the app allows execution of the command
		// this.addCommand({
		// 	id: 'open-sample-modal-complex',
		// 	name: 'Open sample modal (complex)',
		// 	checkCallback: (checking: boolean) => {
		// 		// Conditions to check
		// 		const markdownView = this.app.workspace.getActiveViewOfType(MarkdownView);
		// 		if (markdownView) {
		// 			// If checking is true, we're simply "checking" if the command can be run.
		// 			// If checking is false, then we want to actually perform the operation.
		// 			if (!checking) {
		// 				new SampleModal(this.app).open();
		// 			}

		// 			// This command will only show up in Command Palette when the check function returns true
		// 			return true;
		// 		}
		// 	}
		// });

		// This adds a settings tab so the user can configure various aspects of the plugin
		// this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	// async loadSettings() {
	// 	this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	// }

	// async saveSettings() {
	// 	await this.saveData(this.settings);
	// }
}

class CreateTimelineModal extends Modal {
	constructor(app: App, onSubmit: (startYear: number, endYear: number, interval: number) => void) {
		super(app);
			this.setTitle('Create a timeline Canvas');

			let startYear = '';
			let endYear = '';
			let interval = '';
		new Setting(this.contentEl)
			.setName('Start year')
			.addText((text) =>
				text.onChange((value) => {
					startYear = value;
				}));
		new Setting(this.contentEl)
			.setName('End year')
			.addText((text) =>
				text.onChange((value) => {
					endYear = value;
				}));
		new Setting(this.contentEl)
			.setName('Interval')
			.addText((text) =>
				text.onChange((value) => {
					interval = value;
				}));
		new Setting(this.contentEl)
			.addButton((btn) =>
        btn
			.setButtonText('Submit')
			.setCta()
			.onClick(() => {
				const numberStartYear = Number(startYear.trim())
				const numberEndYear = Number(endYear.trim())
				const numberInterval = Number(interval.trim())

				if (isNaN(numberStartYear) || isNaN(numberEndYear) || isNaN(numberInterval)) {
					new Notice('One or more of the fields are not valid numbers');
				} else if (numberEndYear <= numberStartYear) {
					new Notice('End year is less than or the same as start year');
				} else if (numberInterval <= 0) {
					new Notice('Interval needs to be greater than 0');
				} else if ((numberEndYear - numberStartYear) / numberInterval > 1000) {
					new Notice('Length of timeline cannot be more than 1000 cards long');
				} else {
					this.close();
					onSubmit(numberStartYear, numberEndYear, numberInterval);
				}
			}));
	}

	onOpen() {
		// const {contentEl} = this;
		// contentEl.setText('Woah!');
	}

	onClose() {
		// const {contentEl} = this;
		// contentEl.empty();
	}
}

// class SampleSettingTab extends PluginSettingTab {
// 	plugin: TimelineCanvasPlugin;

// 	constructor(app: App, plugin: TimelineCanvasPlugin) {
// 		super(app, plugin);
// 		this.plugin = plugin;
// 	}

// 	display(): void {
// 		const {containerEl} = this;

// 		containerEl.empty();

// 		new Setting(containerEl)
// 			.setName('Setting #1')
// 			.setDesc('It\'s a secret')
// 			.addText(text => text
// 				.setPlaceholder('Enter your secret')
// 				.setValue(this.plugin.settings.mySetting)
// 				.onChange(async (value) => {
// 					this.plugin.settings.mySetting = value;
// 					await this.plugin.saveSettings();
// 				}));
// 	}
// }