import Label from './label'

export default class LabelGroup {

    constructor (rule, labels) {
        this.labels = {};
        this.pruned = {};
        this.rule = rule;
        this.priority = -Infinity;

        for (var key in labels){
            this.addLabel(key, labels[key]);
        }
    }

    addLabel (key, label) {
        this.labels[key] = label;
        if (label.priority > this.priority) this.priority = label.priority;
    }

    removeLabel (key) {
        // TODO: lower priority
        delete this.labels[key];
    }

    occluded () {
        for (var key in this.labels){
            var label = this.labels[key];
            var isOccluded = Label.prototype.occluded.apply(label, arguments);
            if (isOccluded) this.prune(key);
        }

        return (this.labels.length > 0);
    }

    add () {
        // discard before adding
        var swept_labels = this.sweep(this.rule);

        for (var key in swept_labels){
            var label = swept_labels[key];
            Label.prototype.add.apply(label, arguments);
        }
    }

    inTileBounds () {
        for (var key in this.labels){
            var label = this.labels[key];
            var isInTile = Label.prototype.inTileBounds.apply(label, arguments);
            if (!isInTile) {
                // TODO: add custom moveIntoTile logic method
                if (label.moveIntoTile) {
                    label.moveIntoTile();
                }
                else {
                    return false;
                }
            }
        }
        return true;
    }

    discard (bboxes) {
        for (var key in this.labels){
            var label = this.labels[key];
            var isDiscarded = Label.prototype.discard.apply(label, arguments);
            if (isDiscarded) {
                this.prune(key);
            }
        }
        return (this.labels.length === 0);
    }

    prune (key) {
        this.pruned[key] = true;
    }

    sweep (rule) {
        return rule(this.labels, this.pruned);
    }
}