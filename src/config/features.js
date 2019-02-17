import _ from 'lodash';


const defaultFeatures = {
    showSidePanel: false,
    sidePanelOpenAtStart: false,
};

const loadFeaturesWithOverrides = () => {
    const params = new URLSearchParams(window.location.search);
    const localFeatures = JSON.parse(window.localStorage.getItem('features')) || {};
    const features = Object.assign({}, defaultFeatures, localFeatures);

    for (let feature in defaultFeatures) {
        if (params.has(feature)) {
            features[feature] = params.get(feature).toLowerCase() == 'true';
        }
    }

    if (!_.isEqual(features, defaultFeatures)) {
        window.localStorage.setItem('features', JSON.stringify(features));
    } else if (localFeatures != null) {
        window.localStorage.removeItem('features');
    }

    return features;
};

export default loadFeaturesWithOverrides();