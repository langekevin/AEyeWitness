export interface FileObject {
    key: string
}

export interface FileValidationResult {
    imgOriginalHash: string | undefined,
    imgCalculatedHash: string | undefined,
    metaDataOriginalHash: string | undefined,
    metaDataCalculatedHash: string | undefined,
}

export interface IFileValidation {
    transaction: string,
    file: Buffer,
    metaData: string,
}

export interface ImageMetaData {
    name: string,
    longitute: number,
    latitute: number,
    timestamp: string,
    accuracy: number,
    altitude: number | undefined,
    altitudeAccuracy: number | undefined,
    heading: number | undefined,
    speed: number | undefined,
}

export interface IMetaData {
	Name?: string | undefined;
	Longitute?: number | undefined;
	Latitute?: number | undefined;
	LocalTime?: Date | undefined;
	Accuracy?: number | undefined;
	Altitude?: number | undefined;
	AltitudeAccuracy?: number | undefined;
	Heading?: number | undefined;
	Speed?: number | undefined;
	ServerTime?: Date | undefined;
	Hash?: string | undefined;
}