function makePie (id, data, options)
{
	var colours = ['#3366CC', '#DC3912', '#FF9900', '#109618', '#990099', '#3B3EAC', '#0099C6', '#DD4477', '#66AA00', '#B82E2E', '#316395', '#994499', '#22AA99', '#AAAA11', '#6633CC', '#E67300', '#8B0707', '#329262', '#5574A6', '#3B3EAC'];
	var r = options.pie.r || 100;
	var cx = options.pie.x || r;
	var cy = options.pie.y || r;
	var labelR = options.label.r || Math.floor (.8 * r);
	var labelColour = options.label.colour || 'white';
	var labelStyle = options.label.style || '';
	var legendX = options.legend.x || (cx + r + 20);
	var legendY = options.legend.y || (cy - r + 20);
	var legendR = options.legend.r || 8;
	var legendDy = options.legend.vSpacing || 30;
	var legendDx = options.legend.hSpacing || 10;
	var legendStyle = options.legend.style || '';
	var legendColour = options.legend.colour || '#444';

	var piePaths = '';
	var labels = '';
	var legend = '';
	
	var sum = 0;
	for (idx = 0; idx < data.length; idx ++)
		sum += data [idx] [1];

	var lastAngle = 0;
	for (idx = 0; idx < data.length; idx ++)
	{
		var value = data [idx] [1];
		var colour = data [idx] [2] || colours [idx];
		var name = data [idx] [0];
		var angle = lastAngle + (value / sum * 2 * Math.PI);

		var flag = (angle - lastAngle > Math.PI) ? 1 : 0;
		var x0 = cx + Math.floor (r * Math.sin (lastAngle) );
		var y0 = cy - Math.floor (r * Math.cos (lastAngle) );
		var x1 = cx + Math.floor (r * Math.sin (angle) );
		var y1 = cy - Math.floor (r * Math.cos (angle) );
		piePaths += '<path d="M ' + cx + ' ' + cy + ' L ' + x0 + ' ' + y0 + ' A ' + r + ' ' + r + ' 0 ' + flag + ' 1 ' + x1 + ' ' + y1 + '" stroke="white" stroke-width="2" fill="' + colour + '"></path>';

		var perc = Math.floor (value / sum * 100) + '%';
		var labelAngle = lastAngle + (value / sum * Math.PI);
		var x0 = cx + Math.floor (labelR * Math.sin (labelAngle) );
		var y0 = cy - Math.floor (labelR * Math.cos (labelAngle) );

		labels += '<text x="' + x0 + '" y="' + y0 + '" fill="' + labelColour + '" stroke-width="1" stroke="' + colour + '" style="' + labelStyle + '" alignment-baseline="middle" text-anchor="middle" paint-order="stroke" >' + perc + '</text>';

		lastAngle = angle;

		legend += '<circle cx="' + legendX + '" cy="' + (legendY + idx * legendDy) + '" r="' + legendR + '" stroke="' + colour + '" fill="' + colour + '"></circle>';

		legend +='<text x="' + (legendX + legendR + legendDx) + '" y="' + (legendY + idx * legendDy) + '" fill="' + legendColour + '" style="' + legendStyle + '" alignment-baseline="middle" text-anchor="start" paint-order="stroke" >' + name + '</text>';
	}

	console.log (piePaths);

	document.getElementById (id).innerHTML = piePaths + labels + legend;
}

function makeBars (id, data, options)
{
	var colours = ['#3366CC', '#DC3912', '#FF9900', '#109618', '#990099', '#3B3EAC', '#0099C6', '#DD4477', '#66AA00', '#B82E2E', '#316395', '#994499', '#22AA99', '#AAAA11', '#6633CC', '#E67300', '#8B0707', '#329262', '#5574A6', '#3B3EAC'];
	var barX = options.bars.x || 0;
	var barY = options.bars.y || 0;
	var height = options.bars.h || 40;
	var spacing = options.bars.spacing || 10;
	var width = options.bars.w || 200;
	var unitX = options.units.x || 4;
	var unitY = options.units.y || 20;
	var unitColour = options.units.colour || '#444';
	var unitStyle = options.units.style || '';
	var labelInsideColour = options.labels.insideColour || '#fff';
	var labelOutsideColour = options.labels.outsideColour || unitColour;
	var labelX = options.labels.x || 10;
	var labelStyle = options.labels.style || '';
	var legendX = options.legend.x || 10;
	var legendStyle = options.legend.style || '';
	var legendColour = options.legend.colour || '#444';
	

	var maxValue = 0;
	for (idx = 0; idx < data.length; idx ++)
	{
		var value = data [idx] [1];
		if (value > maxValue) maxValue = value;
	}

	var bars = '';
	var labels = '';
	var legend = '';

	for (idx = 0; idx < data.length; idx ++)
	{
		var value = data [idx] [1];
		var colour = data [idx] [2] || colours [idx];
		var name = data [idx] [0];
		var x = barX;
		var y = barY + idx * (height + spacing);
		var w = Math.floor (value / maxValue * width);
		var h = height;
		bars += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + colour + '"></rect>';

		var x = x + w - labelX;
		var y = y + Math.floor (height / 2);
		labels += '<text id="' + (id + '_label_' + idx) + '" x="' + x + '" y="' + y + '" fill="' + labelInsideColour + '" alignment-baseline="middle" text-anchor="end" paint-order="stroke" style="' + labelStyle + '">' + formatEng (value) + '</text>';

		var x = barX + width + legendX;
		legend += '<text x="' + x + '" y="' + y + '" fill="' + legendColour + '" alignment-baseline="middle" text-anchor="start" paint-order="stroke" style="' + legendStyle + '">' + name + '</text>';		
	}

	var mag = Math.floor (Math.log (maxValue) / Math.log (10) );
	var digit = Math.floor (maxValue / Math.pow (10, mag) );
	if (digit > 9)
	{
		digit = Math.floor (digit / 10);
		mag++;
	}
	console.log ('magnitude ', mag);
	console.log ('digit ', digit);

	var step = 1;

	switch (digit)
	{
		case 1: step = .5; break;
		case 2: step = 1; break;
		case 3: step = 1; break;
		case 4: step = 1; break;
		case 5: step = 2; break;
		case 6: step = 2; break;
		case 7: step = 2; break;
		case 8: step = 2; break;
		case 9: step = 3; break;
	}

	var step = step * Math.pow (10, mag);
	var units = '';

	var unitY = barY + data.length * (height + spacing) - spacing + unitY;
	for (var off = 0; off < maxValue; off += step)
	{
		console.log (off);
		var x = barX + Math.floor (off / maxValue * width);
		units += '<line x1="' + x + '" y1="' + barY + '" x2="' + x + '" y2="' + unitY + '" stroke="black" stroke-width=".5"></line>';
		console.log (formatEng (off) );
		units += '<text x="' + (x + unitX) + '" y="' + unitY + '" fill="' + unitColour + '" alignment-baseline="baseline" text-anchor="start" paint-order="stroke" style="' + unitStyle + '">' + formatEng (off) + '</text>';
	}

	document.getElementById (id).innerHTML = units + bars + labels + legend;

	var outsideLabels = '';

	for (idx = 0; idx < data.length; idx ++)
	{
		var text = document.getElementById (id + '_label_' + idx);
		var textWidth = text.getBBox ().width;
		var value = data [idx] [1];
		var boxWidth = Math.floor (value / maxValue * width);
		console.log (idx, textWidth, boxWidth);
		if (textWidth + 2 * labelX < boxWidth) continue;
		text.remove ();
		var x = barX + boxWidth + labelX;
		var y = barY + idx * (height + spacing) + Math.floor (height / 2);
		outsideLabels += '<text id="' + (id + '_label_' + idx) + '" x="' + x + '" y="' + y + '" fill="' + labelOutsideColour + '" alignment-baseline="middle" text-anchor="start" paint-order="stroke" style="' + labelStyle + '">' + formatEng (value) + '</text>';
	}

	document.getElementById (id).innerHTML += outsideLabels;
}

function formatEng (value)
{
	if (value == 0) return '0';
	var mag = Math.floor (Math.log (value) / Math.log (10) );
	var digit = Math.floor (value / Math.pow (10, mag) );
	if (digit > 9)
	{
		digit = Math.floor (digit / 10);
		mag++;
	}

	prefix = Math.floor (mag / 3);
	var mantissa = value / Math.pow (10, prefix * 3);

	prefices = {'-2': 'μ', '-1': 'm', 0: '', 1: 'k', 2: 'M', 3: 'G', 4: 'T'};

	mantissa = '' + mantissa;
	if (mantissa.length > 3)
		mantissa = mantissa.substring (0, 4);

	if (mantissa.slice (-1) == '.') mantissa = mantissa.slice (0, -1);

	return mantissa + prefices [prefix];
}
