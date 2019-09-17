var GenName = "BlsWriter";

Generators[GenName] = new StagedBrickGenerator(GenName, [new SBG_SlowIterator(function(inst) {
	var tb = inst.bricks[inst.currI];
	var tbn = ToBlsBasicName(tb.BoundingBox.x, tb.BoundingBox.y, tb.BoundingBox.z);
	var nl = tbn.Name + '" '; //name
	nl += (tb.Position.x+tb.BoundingBox.x/2)/2 + " " + (tb.Position.y+tb.BoundingBox.y/2)/2 + " " + (tb.Position.z+tb.BoundingBox.z/2)/5 + " "; //position
	nl += (tb.RotationIndex + tbn.Rotation) * 1 + " "; //rotation index
	nl += "0 "; //is baseplate
	nl += ColorQuantize([tb.Color.r, tb.Color.g, tb.Color.b, 1.0], brsColorsetRGB).SetI + " "; //colorset index
	nl += "  "; //print ID
	nl += "0 0 1 1 1"; //colorfx, shapefx, ray, col, ren
	inst.lines.push(nl);
	
	inst.currI++;
	return inst.currI == inst.maxI;
	//1x16F" -47 -41.25 0.3 1 0 6  0 0 1 1 1
	//BrickName", PosX, PosY, PosZ, AngleID, IsBaseplate, ColorID, Empty Space or PrintID, ColorFXID, ShapeFXID, Ray, Col, Ren
	//Event/light/owner/emitter/etc. (i.e. non-brick) lines start with +-
}, {
	RunSpeed: 50,
	MaxExecTime: 40,
	OnStagePause: function(inst) {
		return "Preparing BLS... " + inst.currI + "/" + inst.maxI;
	}
})], {
	Controls: {},
	OnSetup: function(inst) {
		inst.lines = [];
		inst.bricks = BrickList; //TODO: can this be dehardcoded (from generator-master) somehow? a "required special properties" object that gets indicated to the generator caller?
		
		if(inst.bricks.length == 0) {
			inst.abort = "No bricks to save";
			return;
		}
		
		inst.lines.push("This is a Blockland save file.  You probably shouldn't modify it cause you'll screw it up."); //well i'm gonna write my *own* save file then >:(
		inst.lines.push("1");
		inst.lines.push("Generated by a third-party program (BRSerker)");
		for(var i = 0; i < Math.min(brsColorsetRGB.length, 64); i++) {
			inst.lines.push(brsColorsetRGB[i][0].toFixed(6) + " " + brsColorsetRGB[i][1].toFixed(6) + " " + brsColorsetRGB[i][2].toFixed(6) + " " + brsColorsetRGB[i][3].toFixed(6));
		}
		for(var i = brsColorsetRGB.length; i < 64; i++) {
			inst.lines.push("1.000000 0.000000 1.000000 0.000000");
		}
		
		inst.lines.push("Linecount " + inst.bricks.length);
		
		
		inst.currI = 0;
		inst.maxI = inst.bricks.length;
	},
	OnFinalize: function(inst) {
		inst.lines.push("");
		download("generated.bls", inst.lines.join("\r\n"));
	}
});
var o = new Option(GenName, GenName);
$(o).html(GenName);
$("#generator-type").append(o);
Generators[GenName].OptionElement = o;