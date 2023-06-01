import React, { BaseSyntheticEvent, useEffect, useState } from 'react';
import { NextPage } from "next";
import { Image, Button, Modal } from 'antd';
import styles from '@/styles/upload.module.scss';
import axios from 'axios';
import { ImageMetaData } from '@/store/models/Files';

const Upload: NextPage = () => {
    const [uploadActive, setUploadActive] = useState(false);
    const [image, setImage] = useState<Blob|undefined>(undefined);
    const [metaData, setMetaData] = useState<ImageMetaData|undefined>(undefined);
    
    useEffect(() => {
        if ('geolocation' in navigator) {
            setUploadActive(true);
        }
    }, []);

    const getMetaData = (filename: string) => {
        navigator.geolocation.getCurrentPosition((position) => {
            let userMetaData: ImageMetaData = {
                latitute: position.coords.latitude,
                longitute: position.coords.longitude,
                accuracy: position.coords.accuracy,
                altitude: position.coords.altitude || undefined,
                altitudeAccuracy: position.coords.altitudeAccuracy || undefined,
                heading: position.coords.heading || undefined,
                speed: position.coords.speed || undefined,
                name: filename,
                timestamp: new Date().toISOString()
            }

            setMetaData(userMetaData)

        }, (error) => {
            // Was not possible to get the users geolocation
            console.log(error);
            
            Modal.error({
                title: 'File upload not possible',
                content: (
                    <div>
                        <p>
                            The file upload is not possible because the current
                            location could not be requested. Please make sure
                            that the location can be requested.
                        </p>
                    </div>
                )
            });

            setUploadActive(false);
            return false;
        })

        return true;
    }

    /**
     * Saves the uploaded image in the state
     * @param e Event from the input
     */
    const uploadImage = (e: BaseSyntheticEvent): void => {
        const file = e.target.files[0];
        if (file) {
            if (getMetaData(file.name)){
                setImage(file);
            }
        }
    }
    
    /**
     * Uploads the image to the server.
     */
    const postImage = () => {
        if (!uploadActive) {
            return;
        }

        if (!image || !metaData) {
            Modal.error({
                title: 'No file available',
                content: (
                    <div>
                        <p>
                            There are no files available to upload.
                            Please first select the file that needs to be uploaded.
                        </p>
                    </div>
                )
            })
            return;
        }
        
        const formData = new FormData();
        formData.append('file', image);

        Object.keys(metaData).forEach(key => {
            const value = metaData[key as keyof ImageMetaData];
            if (value) {
                formData.append(key, value.toString());
            }
        });

        axios.post(`${process.env.NEXT_PUBLIC_API_URL}/upload`, formData).then(response => {
            if (response.status === 201) {
                Modal.success({
                    title: 'Upload successful',
                    content: (
                        <p>
                            The Upload of the file was successful. You can now see it in
                            the main page.
                        </p>
                    )
                })
            }
        }).catch(err => {
            Modal.error({
                title: 'Upload failed',
                content: (
                    <p>
                        There was an error while uploading the file...
                        {err.message}
                    </p>
                )
            })
        })
    }

    return (
        <>
            <h1>Upload Image</h1>
            {
                uploadActive ?

                <div>

                    <label htmlFor="images" className={styles.dropContainer}>
                        <input type="file" id="images" accept="image/*" onChange={(e) => uploadImage(e)} required />
                    </label>

                    <div className={styles.imageContainer}>
                        <Image
                            width={'100%'}
                            src={image ? URL.createObjectURL(image) : ''}
                            fallback='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=='
                        />
                    </div>


                    <Button onClick={postImage} className={styles.uploadButton}>Upload file</Button>
                </div>

                :

                <h2>Upload from this device not possible!</h2>
            }
        </>
    )
}

export default Upload;
